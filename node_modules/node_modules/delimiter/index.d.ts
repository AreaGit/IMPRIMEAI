export default function delimiter<Type extends any, Serial extends any = string, Delimiter extends any = string>(arr: Array<Type>, serial?: Serial, delimiter?: Delimiter): Array<Type & Serial & Delimiter>;

export {};
