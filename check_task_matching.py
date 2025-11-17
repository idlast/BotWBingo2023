import pandas as pd
import json
import re

csv_path = r"参考用ビンゴ資料 2023-2-22 - タスクの重み調整.csv"
js_path = r"tables/botwBingo2023.js"

df = pd.read_csv(csv_path, encoding='utf-8')
csv_tasks = set(df['元からあるタスク'].tolist())

with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

js_task_names = []
matches = re.findall(r'"name":\s*"([^"]+)"', js_content)
js_task_names = matches

js_task_set = set(js_task_names)

print("=" * 80)
print("【JSファイルに存在するタスク数】", len(js_task_set))
print("【CSVファイルに存在するタスク数】", len(csv_tasks))
print("=" * 80)

js_only = js_task_set - csv_tasks
csv_only = csv_tasks - js_task_set

if js_only:
    print("\n【JSにあるがCSVにないタスク】 ({})".format(len(js_only)))
    print("-" * 80)
    for task in sorted(js_only):
        print(f"  - {task}")
else:
    print("\n【JSにあるがCSVにないタスク】 0件")

if csv_only:
    print("\n【CSVにあるがJSにないタスク】 ({})".format(len(csv_only)))
    print("-" * 80)
    for task in sorted(csv_only):
        print(f"  - {task}")
else:
    print("\n【CSVにあるがJSにないタスク】 0件")

matched_count = len(js_task_set & csv_tasks)
print("\n" + "=" * 80)
print(f"【マッチしたタスク数】 {matched_count} / {len(js_task_set)}")
print(f"【マッチ率】 {matched_count / len(js_task_set) * 100:.2f}%")
print("=" * 80)

if matched_count == len(js_task_set):
    print("\n完璧ですわ～～～！！！！全てのタスクがマッチしてますの！！！！")
else:
    print("\n不一致がありますわ～～！修正が必要ですの！")
