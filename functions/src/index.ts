import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

const SLACK_TOKEN: string = `${functions.config().key.slack}`;
const GITHUB_TOKEN: string = `${functions.config().key.github}`;
const GITHUB_BASE_PATH: string = `https://api.github.com`;

const INIT_ERROR_MESSAGE: string = `[ERROR] You need setup!!`;
const PARAMS_ERROR_MESSAGE: string = `[ERROR] リポジトリ名は必須です`;

const DEFAULT_HEAD_NAME :string = `dev`;
const DEFAULT_BASE_NAME :string  = `master`;
const DEFAULT_MESSAGE_NAME : string = ``;

export const createPR = functions.https.onRequest(async (req, res) => {

    // Slackとの認証確認
    if (req.body.token !== SLACK_TOKEN) { res.send(INIT_ERROR_MESSAGE);}

    try {

        let repo: string;        // 対象リポジトリ名 ※必須 (:owner/:repo)
        let head: string;       // マージ元ブランチ
        let base: string;       // マージ先ブランチ
        let message: string;    // メッセージ

        const params: string[] = req.body.text.split(/\s+/);

        // Params不足確認
        if ((params.length === 1) && (params[0] === "")) {res.send(PARAMS_ERROR_MESSAGE);}

        [repo, head, base, message] = params;
        if (!head) { head = DEFAULT_HEAD_NAME }
        if (!base) { base = DEFAULT_BASE_NAME }
        if (!message) { message = DEFAULT_MESSAGE_NAME }

        const title: string = `PR: ${head} to ${base}`;
        message = `${message}\n Create By Slack`;

        // https://developer.github.com/v3/pulls/#create-a-pull-request
        const path: string = `${GITHUB_BASE_PATH}/repos/${repo}/pulls?state=closed`;

        const method :string = "POST";
        const headers = {
            'Accept': `application/vnd.github.shadow-cat-preview+json`,
            'Content-Type': `application/vnd.github.shadow-cat-preview+json`,
            'Authorization': `token ${GITHUB_TOKEN}`,
        };
        const body = JSON.stringify({
            title: title,
            head: head,
            base: base,
            body: message,
        });

        const option = {
            body,
            method,
            headers,
        };

        // ログ出力
        console.log(`params:`, repo, head, base, message);

        const response = await fetch(path, option);
        const status = await response.status;
        const statusText = await response.statusText;
        const json = await response.json();

        // ステータスコード201以外はエラー返信
        if (status !== 201) { throw Error(`${status}: ${statusText}`) }

        // ログ出力
        console.log(`${status}: ${statusText}`);
        console.log(json);

        res.send({
                "response_type": "in_channel",
                "text": `${json.title}(${repo})`,
                "attachments": [
                    {
                        "text": json.html_url
                    }
                ]
            });

    } catch(e) {
        // ログ出力
        console.error(`[ERROR] ${e}`);
        res.send({
            "response_type": "in_channel",
            "text": `[ERROR] ${e}`
        });
    }

});
