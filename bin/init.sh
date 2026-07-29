#!/usr/bin/env bash
#
# Initialise a service created from this template.
# Replaces template values, renames the Helm chart and removes template files.

set -Eeuo pipefail

trap 'exit_code=$?; printf "\nInitialisation failed on line %s. Review the partial changes before retrying.\n" "$LINENO" >&2; exit "$exit_code"' ERR

readonly SCRIPT_DIR="$(
  cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
  pwd -P
)"

readonly REPO_ROOT="$(
  cd -- "${SCRIPT_DIR}/.."
  pwd -P
)"

cd "${REPO_ROOT}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: ${REPO_ROOT} is not inside a Git repository." >&2
  exit 1
fi

readonly GIT_ROOT="$(
  cd -- "$(git rev-parse --show-toplevel)"
  pwd -P
)"

if [[ "${GIT_ROOT}" != "${REPO_ROOT}" ]]; then
  echo "Error: expected repository root to be ${REPO_ROOT}, but Git reports ${GIT_ROOT}." >&2
  exit 1
fi

required_paths=(
  "package.json"
  "README.md"
  "src/main"
  "charts/rpe-expressjs-template"
)

for required_path in "${required_paths[@]}"; do
  if [[ ! -e "${required_path}" ]]; then
    echo "Error: expected template path does not exist: ${required_path}" >&2
    exit 1
  fi
done

read -r -p "Port number for new app: " port
read -r -p "Product name, replacing 'rpe': " product
read -r -p "Component name, replacing 'expressjs-template': " component

if [[ ! "${port}" =~ ^[0-9]+$ ]] || ((port < 1 || port > 65535)); then
  echo "Error: port must be a number between 1 and 65535." >&2
  exit 1
fi

readonly SLUG_PATTERN='^[a-z0-9]+(-[a-z0-9]+)*$'

if [[ ! "${product}" =~ ${SLUG_PATTERN} ]]; then
  echo "Error: product must contain lowercase letters, numbers and single hyphens only." >&2
  exit 1
fi

if [[ ! "${component}" =~ ${SLUG_PATTERN} ]]; then
  echo "Error: component must contain lowercase letters, numbers and single hyphens only." >&2
  exit 1
fi

readonly old_port="3100"
readonly old_product="rpe"
readonly old_component="expressjs-template"
readonly old_slug="${old_product}-${old_component}"
readonly new_slug="${product}-${component}"

readonly old_chart_directory="charts/${old_slug}"
readonly new_chart_directory="charts/${new_slug}"

# Search only template-owned source files. Vendored/generated package-manager
# files must not be modified by template replacement.
readonly -a template_search_paths=(
  "."
  ":(exclude)bin/init.sh"
  ":(exclude).yarn/**"
  ":(exclude).pnp.*"
)

printf '\nInitialising service:\n'
printf '  Port:      %s\n' "${port}"
printf '  Product:   %s\n' "${product}"
printf '  Component: %s\n' "${component}"
printf '  Slug:      %s\n\n' "${new_slug}"

replace_port() {
  local file

  while IFS= read -r file; do
    [[ -n "${file}" ]] || continue

    PORT="${port}" perl -i -pe \
      's/(?<![0-9])3100(?![0-9])/$ENV{PORT}/g' \
      "${file}"
  done < <(
    git grep -IlE \
      -e "(^|[^0-9])${old_port}([^0-9]|$)" \
      -- "${template_search_paths[@]}" ||
      true
  )
}

replace_template_names() {
  local file

  while IFS= read -r file; do
    [[ -n "${file}" ]] || continue

    PRODUCT="${product}" \
    COMPONENT="${component}" \
    NEW_SLUG="${new_slug}" \
      perl -i -pe '
        s{rpe-expressjs-template|\brpe\b|expressjs-template}{
          $& eq "rpe-expressjs-template"
            ? $ENV{NEW_SLUG}
            : $& eq "rpe"
              ? $ENV{PRODUCT}
              : $ENV{COMPONENT}
        }ge
      ' "${file}"
  done < <(
    git grep -IlE \
      -e "${old_slug}" \
      -e "${old_component}" \
      -e "(^|[^[:alnum:]_])${old_product}([^[:alnum:]_]|$)" \
      -- "${template_search_paths[@]}" ||
      true
  )
}

clean_readme() {
  local header
  local -ar headers_to_delete=(
    "What is included"
    "Initialise the service"
    "Creating a service from the template"
  )

  for header in "${headers_to_delete[@]}"; do
    HEADER="${header}" perl -0777 -i -pe '
      s{
        ^\#\#\ \Q$ENV{HEADER}\E[^\n]*\n
        .*?
        (?=^\#\#\ |\z)
      }{}gmsx
    ' README.md
  done

  NEW_SLUG="${new_slug}" perl -0777 -i -pe '
    s{
      \A
      .*?
      (?=^\#\#\ )
    }{
      "# $ENV{NEW_SLUG}\n\n"
    }emxs
  ' README.md
}

rename_chart() {
  if [[ "${old_chart_directory}" == "${new_chart_directory}" ]]; then
    return
  fi

  if [[ -e "${new_chart_directory}" ]]; then
    echo "Error: chart destination already exists: ${new_chart_directory}" >&2
    exit 1
  fi

  git mv -- "${old_chart_directory}" "${new_chart_directory}"
}

remove_template_workflows() {
  if [[ -d .github/workflows ]]; then
    rm -rf -- .github/workflows
    rmdir .github 2>/dev/null || true
  fi
}

check_for_remaining_template_references() {
  local remaining_references

  remaining_references="$(
    git grep -InE \
      -e "${old_slug}" \
      -e "${old_component}" \
      -e "(^|[^[:alnum:]_])${old_product}([^[:alnum:]_]|$)" \
      -e "(^|[^0-9])${old_port}([^0-9]|$)" \
      -- "${template_search_paths[@]}" \
      2>/dev/null ||
      true
  )"

  if [[ -n "${remaining_references}" ]]; then
    echo
    echo "Warning: some template references remain:"
    echo "${remaining_references}"
  fi
}

remove_template_workflows
replace_port
replace_template_names
rename_chart
clean_readme
check_for_remaining_template_references

rm -- "${SCRIPT_DIR}/init.sh"

echo
echo "Initialisation complete."
echo
git status --short
