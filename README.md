# StrikeMetric 2.0

A web application for analyzing boxing punch metrics with an interactive drag-and-drop combo builder. This application helps trainers and athletes track and analyze punch performance metrics including speed, force, and accuracy.

## Project Structure

```
strikeMetric2/
├── frontend/         # React/Next.js frontend application
├── backend/         # FastAPI backend application
```

## Features

- 🥊 Punch data entry with metrics (speed, force, accuracy)
- 🔄 Interactive drag-and-drop combo builder
- 📊 Performance analytics
- 👥 Multi-athlete support
- 📝 Training session management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- pip (Python package manager)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn src.main:app --reload
   ```

## Development

### Frontend Technologies
- Next.js
- React
- TypeScript
- Tailwind CSS
- @dnd-kit for drag-and-drop functionality

### Backend Technologies
- FastAPI
- SQLAlchemy
- Alembic for database migrations
- PostgreSQL

## Testing the Combo Builder

1. Select an athlete and training session
2. Switch to "Combo" mode
3. Add punches using the punch type buttons
4. Drag and reorder punches in your combo
5. Use keyboard navigation:
   - Tab to focus on draggable items
   - Space to start/stop dragging
   - Arrow keys to move items
   - Escape to cancel dragging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 