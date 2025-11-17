import pandas as pd
import json

csv_path = r"参考用ビンゴ資料 2023-2-22 - タスクの重み調整.csv"
output_path = r"tables/botwBingo2023_with_weights.js"

df = pd.read_csv(csv_path, encoding='utf-8')

tasks = []
for _, row in df.iterrows():
    task = {
        "name": row['元からあるタスク'],
        "en": row.get('英語名', ''),
        "difficulty": float(row['重さ']),
        "types": json.loads(row['types']) if pd.notna(row.get('types')) else []
    }
    tasks.append(task)

tasks.sort(key=lambda x: x["name"])

output_lines = ["var bingoList = [\n"]
for i, task in enumerate(tasks):
    comma = "," if i < len(tasks) - 1 else ""
    types_str = json.dumps(task["types"], ensure_ascii=False)
    line = f'    {{"name": "{task["name"]}", "en": "{task["en"]}", "difficulty": {task["difficulty"]}, "types": {types_str}}}{comma}\n'
    output_lines.append(line)
output_lines.append("];\n")

with open(output_path, 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print(f"CSV → JS 変換完了: {len(tasks)} タスク")
print(f"出力: {output_path}")
