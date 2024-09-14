# AirNotes - a note-taking web app

The frontend of a basic note taking app inspired by Notion. There are still bugs regarding the UI and features so this
web app should not be used in production. Sample screenshots are included below.

![img.png](screenshots/screenshot1.png)

![img.png](screenshots/screenshot2.png)

![img.png](screenshots/screenshot3.png)

![img.png](screenshots/screenshot4.png)

## :white_check_mark: Requirement

* React
* Vite
* Firebase
* Tiptap

## :computer: Usage

Clone the repository

```angular2html
git clone https://github.com/dashluu/AirNotes-web.git
```

Go to the project directory and run

```
// To install packages
npm install
// To run the web app
npm run dev
```

Open http://localhost:5173 to see the web app!

## :rocket: Features

- :white_check_mark: Basic editor with different types of lists, headings, formatting styles, and text alignment
- :white_check_mark: Add images via links, drag and drop, and uploading
- :white_check_mark: Summarizing the document using LLM
- :white_check_mark: Answer questions from the document using LLM
- :white_check_mark: Search all documents semantically using vector search and LLM
- :white_check_mark: Generate images with Stable Diffusion(slow)

## :warning: Known issues

* Streaming response is not working for Safari
* UI is not great for small-screen devices
* Some UI elements do not animate smoothly
* Untested email and password reset
* Pagination might work incorrectly if the data is updated(removed or inserted) continuously
* Search is still limited, especially home page search


