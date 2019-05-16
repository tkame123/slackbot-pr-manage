import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

const SLACK_TOKEN: string = `j5Yuilt0O9nvZwDgzOE1LDXd`;
// const GITHUB_TOKEN=`test`;
const GITHUB_BASE_PATH: string = `https://api.github.com`;

const INIT_ERROR_MESSAGE: string = `[ERROR] You need setup!!`;
const PARAMS_ERROR_MESSAGE: string = `[ERROR] リポジトリ名は必須です`;

export const createPR = functions.https.onRequest(async (req, res) => {

    // Slackとの認証確認
    if (req.body.token !== SLACK_TOKEN) { res.send(INIT_ERROR_MESSAGE);}

    try {

        let rep: string;        // 対象リポジトリ名 ※必須 (:owner/:repo)
        let head: string;       // マージ元ブランチ
        let base: string;       // マージ先ブランチ
        let message: string;    // メッセージ

        const params: string[] = req.body.text.split(/\s+/);

        // Params不足確認
        if ((params.length === 1) && (params[0] === "")) {res.send(PARAMS_ERROR_MESSAGE);}

        [rep, head, base, message] = params;

        const path: string = `${GITHUB_BASE_PATH}/repos/tkame123/study_javascript_designpattern/issues`;

        const method = "GET";

        const headers = {
            'Accept': 'application/vnd.github.shadow-cat-preview+json',
            'Content-Type': 'application/vnd.github.shadow-cat-preview+json',
            // 'Authorization': 'Bearer ' + GITHUB_TOKEN,
        };

        // const body = JSON.stringify({
        //     state: "open"
        // });

        const option: any = {
            method,
            headers
        };

        await fetch(  path, option)
            .then((response: any) => {
               console.log(response);
            }).catch((e) => {
                throw e;
        });

        res.send(`${rep}\n${head}\n${base}\n${message}`);

    } catch(e) {
        console.log(e);
        res.send(`[ERROR]${e}`);
    }

});
