
interface Markdown {
    toHTML(text: string): string;
}


declare var markdown: Markdown;

declare module "markdown" {
    export = markdown;
}
