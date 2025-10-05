# Chess Grandmasters Wiki

A React application that displays information about chess grandmasters using the Chess.com API.

## Features

- Browse chess grandmasters with detailed profiles
- Search and sort functionality
- League specific styling
- Responsive design
- Real-time data from Chess.com API

## Live Demo

Visit the live application at: [https://geoff001.github.io/chessGMListWiki/](https://geoff001.github.io/chessGMListWiki/)

## Technologies Used

- React 19
- TypeScript
- Vite
- Font Awesome
- Chess.com API
- CSS3

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

## Compromises

The following compromises were made during development to balance functionality with performance and maintainability, while also working within time constraints:

- **Limited Data Fetching**: Restricted to the first 50 grandmasters only. Future implementation should include batch processing with delays between batches to handle larger datasets and avoid overwhelming the browser.

- **Component Reusability**: Some sections like the loader should be extracted into reusable components to improve code organization and maintainability.

- **Styling Architecture**: Should implement SASS/SCSS for more organized CSS styling and better maintainability.

- **Error Handling**: Comprehensive error handlers should be implemented to provide better user experience and debugging capabilities.

- **CSS Variables**: Should utilize CSS custom properties (variables) to centralize values and make them easier to update across the application.

- **Responsive Design**: Could be enhanced to provide better mobile and tablet experiences across different screen sizes.

- **TypeScript Typing**: Should avoid using "any" type in TypeScript interfaces for fetched data to ensure better type safety and code reliability.
