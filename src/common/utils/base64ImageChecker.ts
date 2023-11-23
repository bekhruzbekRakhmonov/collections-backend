export function isBase64Image(str: string) {
    const imageRegex = /^data:image\/(jpeg|jpg|gif|png|webp);base64,/;

    return imageRegex.test(str);
}
