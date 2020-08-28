import { Application } from 'express';

export default function(app: Application) {

  app.get('/', (req, res) => {
    res.render('home');
  });

}
