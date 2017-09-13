interface ViewError {
  statusCode: number
  associatedView?: string
}

export class NotFoundError extends Error implements ViewError {
  statusCode: number = 404
  associatedView: string = 'not-found'

  constructor (page: string) {
    super(`Page ${page} does not exist`)
  }
}
