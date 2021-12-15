# Mini Asana

## Description

MiniAsana is a **React** project using **hooks** with **Typescript** and working with **firebase 8.5**. You can signup, login, logout with an email/password thanks to the firebase **Authentication** service. **SCSS** has been used to style the application.

Once you are logged in with an user account, you have access to a dashboard where you can see all the current projects created by all the different users. You can filter these projects dependeing on some parameters. You can also see all the users and if they are online and manage your own projects. Furthermore any user can comment any current project.

Everything is stored with the **Firestore** and the **Storage** services of Firebase.

The project is online and hosted at this url:

https://mini-asana.web.app/

## Run the project locally

To run the project locally,
clone the repository :
```
git clone git@github.com:LouisHatte/WebApp-miniAsana.git
```
Open the project with an IDE like Visual Studio Code.

Open a termial and make sure to be at the root of the project (where you can find the README.md file).

Make sure to have the package manager `yarn` on your system or install it like so:
```
npm install -g yarn
```

Run the command :
```
yarn install
```
to install all the dependencies needed.

Once you are done with that, you can start the project by running the command :
```
yarn start
```
Then, open a browser like Brave and the project should be running on the url http://localhost:3000 by default.
