# Firestore 認証エラーのトラブルシューティング

## エラー内容
```
16 UNAUTHENTICATED: Request had invalid authentication credentials
```

## 確認事項

### 1. Firestore API が有効化されているか
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクト `charger-6d05b` を選択
3. **APIとサービス** > **有効なAPI** に移動
4. **Cloud Firestore API** が有効になっているか確認
5. 無効な場合は、**APIとサービス** > **ライブラリ** から **Cloud Firestore API** を検索して有効化

### 2. サービスアカウントの権限を確認
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. **IAMと管理** > **サービスアカウント** に移動
3. `firebase-adminsdk-fbsvc@charger-6d05b.iam.gserviceaccount.com` を検索
4. 権限を確認:
   - **Firebase Admin SDK Administrator Service Agent** または
   - **Cloud Datastore User** または
   - **Firebase Admin** のいずれかのロールが必要

### 3. サービスアカウントキーを再生成
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト `charger-6d05b` を選択
3. **プロジェクトの設定** (歯車アイコン) > **サービスアカウント** タブ
4. **新しい秘密鍵の生成** をクリック
5. ダウンロードしたJSONファイルを `serviceAccountKey.json` としてプロジェクトルートに配置

### 4. Firestore データベースが作成されているか
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. **Firestore Database** に移動
3. データベースが作成されていない場合は、**データベースを作成** をクリック
4. **本番モード** または **テストモード** を選択（開発中はテストモード推奨）

## 解決方法

### 方法1: サービスアカウントに権限を付与
1. Google Cloud Console で **IAMと管理** > **IAM** に移動
2. `firebase-adminsdk-fbsvc@charger-6d05b.iam.gserviceaccount.com` を検索
3. **編集** をクリック
4. **ロールを追加** をクリック
5. 以下のいずれかを追加:
   - `Firebase Admin SDK Administrator Service Agent`
   - `Cloud Datastore User`
   - `Firebase Admin`

### 方法2: 新しいサービスアカウントキーを生成
上記の「3. サービスアカウントキーを再生成」を実行

## 確認コマンド
スクリプトを実行すると、接続テストが行われます:
```bash
npm run firestore:upload:libraries
```

接続テストが成功すれば、Firestoreへの書き込みが可能です。

