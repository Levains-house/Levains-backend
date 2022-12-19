export class UserHomeResponse {

    constructor(public category_items: Array<CategoryItemResponse>,
                public experience_items: Array<ExperienceItemResponse>) {}

}

export class CategoryItemResponse {
    public item_id: bigint | undefined;
    public img_url: string | undefined;
    public name: string | undefined;
    public description: string | undefined;
    public category: string | undefined;
    public kakao_talk_chatting_url: string | undefined;
    public want_name: string | undefined;
    public want_description: string | undefined;
    public want_category: string | undefined;

    constructor(item_id: bigint | undefined, img_url: string | undefined, name: string | undefined, description: string | undefined, category: string | undefined, kakao_talk_chatting_url: string | undefined, want_name: string | undefined, want_description: string | undefined, want_category: string | undefined) {
        this.item_id = item_id;
        this.img_url = img_url;
        this.name = name;
        this.description = description;
        this.category = category;
        this.kakao_talk_chatting_url = kakao_talk_chatting_url;
        this.want_name = want_name;
        this.want_description = want_description;
        this.want_category = want_category;
    }
}

export class ExperienceItemResponse {
    public item_id: bigint | undefined;
    public img_url: string | undefined;
    public name: string | undefined;
    public description: string | undefined;
    public category: string | undefined;
    public kakao_talk_chatting_url: string | undefined;

    constructor(item_id: bigint | undefined, img_url: string | undefined, name: string | undefined, description: string | undefined, category: string | undefined, kakao_talk_chatting_url: string | undefined) {
        this.item_id = item_id;
        this.img_url = img_url;
        this.name = name;
        this.description = description;
        this.category = category;
        this.kakao_talk_chatting_url = kakao_talk_chatting_url;
    }
}