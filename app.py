from flask import Flask, render_template, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

# Load dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
df = pd.read_excel(os.path.join(BASE_DIR, "CatScore_MBA_Dataset.xlsx"))

# Fix NIRF rank
df["nirf_2025_management_rank"] = df["nirf_2025_management_rank"].replace(
    "Not Ranked in Top NIRF List", "Unranked"
)

CATEGORY_MAP = {
    "GENERAL": "CAT_General",
    "EWS": "CAT_EWS",
    "OBC": "CAT_OBC",
    "SC": "CAT_SC",
    "ST": "CAT_ST",
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/eligible", methods=["POST"])
def get_eligible_colleges():
    data = request.get_json()
    name = data.get("name", "").strip()
    dob = data.get("dob", "")
    twelfth = float(data.get("twelfth", 0))
    cat_score = float(data.get("cat_score", 0))
    category = data.get("category", "").strip().upper()

    col = CATEGORY_MAP.get(category)
    if not col:
        return jsonify({"error": "Invalid category"}), 400

    eligible = []
    for _, row in df.iterrows():
        cutoff = row[col]
        twelfth_cutoff = row.get("12th %", 0) or 0
        if cat_score >= cutoff and twelfth >= twelfth_cutoff:
            eligible.append({
                "college_name": str(row["college_name"]),
                "tier": str(row["tier"]),
                "city": str(row["city"]),
                "state": str(row["state"]),
                "ownership_type": str(row["ownership_type"]),
                "institute_category": str(row["institute_category"]),
                "fees": float(row["Fees (Lakhs)"]) if pd.notna(row["Fees (Lakhs)"]) else 0,
                "avg_package": float(row["Avg Package (LPA)"]) if pd.notna(row["Avg Package (LPA)"]) else 0,
                "roi_score": float(row["roi_score"]) if pd.notna(row["roi_score"]) else 0,
                "placement_pct": float(row["Placement %"]) if pd.notna(row["Placement %"]) else 0,
                "cutoff_used": float(cutoff),
            })

    eligible.sort(key=lambda x: x["roi_score"], reverse=True)
    return jsonify({"name": name, "colleges": eligible, "count": len(eligible)})


@app.route("/api/college/<name>", methods=["GET"])
def get_college_details(name):
    row = df[df["college_name"].str.strip().str.lower() == name.strip().lower()]
    if row.empty:
        return jsonify({"error": "College not found"}), 404
    r = row.iloc[0]

    details = {
        "college_name": str(r["college_name"]),
        "tier": str(r["tier"]),
        "city": str(r["city"]),
        "state": str(r["state"]),
        "country": str(r["country"]),
        "ownership_type": str(r["ownership_type"]),
        "institute_category": str(r["institute_category"]),
        "program_duration": str(r["program_duration"]),
        "specializations": str(r["specializations"]),
        "fees": float(r["Fees (Lakhs)"]) if pd.notna(r["Fees (Lakhs)"]) else 0,
        "avg_package": float(r["Avg Package (LPA)"]) if pd.notna(r["Avg Package (LPA)"]) else 0,
        "highest_package": float(r["Highest Package (LPA)"]) if pd.notna(r["Highest Package (LPA)"]) else 0,
        "placement_pct": float(r["Placement %"]) if pd.notna(r["Placement %"]) else 0,
        "roi_score": float(r["roi_score"]) if pd.notna(r["roi_score"]) else 0,
        "scholarships_available": str(r["scholarships_available"]),
        "scholarship_type": str(r["scholarship_type"]),
        "internship_mandatory": str(r["internship_mandatory"]),
        "exchange_program_available": str(r["exchange_program_available"]),
        "nirf_applicable": str(r["nirf_applicable"]),
        "nirf_rank": str(r["nirf_2025_management_rank"]),
        "official_website": str(r["official_website"]) if pd.notna(r["official_website"]) else "#",
        "cat_general": float(r["CAT_General"]) if pd.notna(r["CAT_General"]) else 0,
        "cat_ews": float(r["CAT_EWS"]) if pd.notna(r["CAT_EWS"]) else 0,
        "cat_obc": float(r["CAT_OBC"]) if pd.notna(r["CAT_OBC"]) else 0,
        "cat_sc": float(r["CAT_SC"]) if pd.notna(r["CAT_SC"]) else 0,
        "cat_st": float(r["CAT_ST"]) if pd.notna(r["CAT_ST"]) else 0,
    }
    return jsonify(details)


if __name__ == "__main__":
    app.run(debug=True)
