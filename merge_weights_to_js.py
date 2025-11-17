import pandas as pd
import json
import re

csv_path = r"参考用ビンゴ資料 2023-2-22 - タスクの重み調整.csv"
js_path = r"tables/botwBingo2023.js"
output_path = r"tables/botwBingo2023_with_weights.js"

df = pd.read_csv(csv_path, encoding='utf-8')
weight_map = dict(zip(df['元からあるタスク'], df['重さ']))

with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

pattern = r'\{\s*"name":\s*"([^"]+)",\s*"en":\s*"([^"]+)",\s*"types":\s*(\[[^\]]+\])\s*\}'

all_tasks = []
for match in re.finditer(pattern, js_content):
    name = match.group(1)
    en = match.group(2)
    types = match.group(3)
    
    weight = weight_map.get(name, None)
    
    if weight is not None:
        task_obj = {
            "name": name,
            "en": en,
            "difficulty": weight,
            "types": types
        }
        all_tasks.append(task_obj)
    else:
        print(f"警告: タスク '{name}' の重みが見つかりません")

all_tasks.sort(key=lambda x: x["name"])

output_lines = ["var bingoList = [\n"]
for i, task in enumerate(all_tasks):
    comma = "," if i < len(all_tasks) - 1 else ""
    line = f'    {{"name": "{task["name"]}", "en": "{task["en"]}", "difficulty": {task["difficulty"]}, "types": {task["types"]}}}{comma}\n'
    output_lines.append(line)
output_lines.append("];\n")

with open(output_path, 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("=" * 80)
print("【マージ完了】")
print(f"出力ファイル: {output_path}")
print("=" * 80)

print(f"\n総タスク数: {len(all_tasks)}")
print(f"タスク名でソート済み")
print(f"フラットな配列構造に変換完了")
print("\n" + "=" * 80)
