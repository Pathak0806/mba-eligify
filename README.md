# MBA Eligify — Flask Web App

## Setup & Run

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Make sure `CatScore_MBA_Dataset.xlsx` is in the same folder as `app.py`

3. Run:
   ```
   python app.py
   ```

4. Open your browser at: **http://localhost:5000**

## Project Structure
```
mba_eligify/
├── app.py                      # Flask backend
├── CatScore_MBA_Dataset.xlsx   # Dataset
├── requirements.txt
├── templates/
│   └── index.html              # Main HTML page
└── static/
    ├── css/style.css           # Styles
    └── js/main.js              # Frontend logic
```
