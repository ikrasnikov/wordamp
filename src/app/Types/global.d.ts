type TUser = {
    name: string,
    score: number,
    id: number,
    isActive: boolean,
    result: string
};

type TCard = {
    id:number,
    wordId:number,
    isOpen:boolean,
    isHide:boolean,
    word:string
};

type TInputData = {
    type:string,
    languages:string,
    difficulty:string,
    username:string
};