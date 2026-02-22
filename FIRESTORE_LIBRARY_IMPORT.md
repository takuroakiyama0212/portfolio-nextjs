# Firestore 一括アップロード（libraries）

このプロジェクトにある CSV（`plconnect-directory-branches-2024-05-29.csv`）を、Firebase Firestore の `libraries` コレクションへ一括アップロードします。

## 重要（セキュリティ）

- `serviceAccountKey.json` は **絶対にGitにコミットしない**でください（このリポジトリでは `.gitignore` 済み）。
- もし秘密鍵を共有してしまった場合は、Firebase Console で **該当サービスアカウントキーを無効化（削除）して新規発行**してください。

## 事前準備

プロジェクトルート（`package.json` がある場所）に以下の2ファイルを置きます。

- `./serviceAccountKey.json`
  - Firebase Admin SDK のサービスアカウント鍵（JSON）
  - 例: 手元の `charger-6d05b-firebase-adminsdk-....json` をこの名前にリネーム
- `./plconnect-directory-branches-2024-05-29.csv`

## 依存関係

このプロジェクトには以下が入っています:

- `firebase-admin`
- `csv-parser`

もし手元環境で未インストールなら:

```bash
npm i
```

## 実行

本番アップロード:

```bash
npm run firestore:upload:libraries
```

ドライラン（Firestoreに書き込まないでCSVだけ読み、件数確認）:

```bash
DRY_RUN=1 npm run firestore:upload:libraries
```

## 仕様

- **保存先**: Firestore `libraries` コレクション
- **docId**: `(Branch Name + Address + Lat + Lon)` を元にした SHA1 の固定ID（再実行しても同じIDに `merge: true` で上書き）
- **スキップ条件**: 緯度/経度が無い行はスキップ



