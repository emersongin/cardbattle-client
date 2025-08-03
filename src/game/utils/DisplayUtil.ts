export class DisplayUtil {
    static column1of12(width: number): number {
        return width / 12;
    }

    static column2of12(width: number): number {
        return DisplayUtil.column1of12(width) * 2;
    }

    static column3of12(width: number): number {
        return DisplayUtil.column1of12(width) * 3;
    }

    static column4of12(width: number): number {
        return DisplayUtil.column1of12(width) * 4;
    }

    static column5of12(width: number): number {
        return DisplayUtil.column1of12(width) * 5;
    }

    static column6of12(width: number): number {
        return DisplayUtil.column1of12(width) * 6;
    }

    static column7of12(width: number): number {
        return DisplayUtil.column1of12(width) * 7;
    }

    static column8of12(width: number): number {
        return DisplayUtil.column1of12(width) * 8;
    }

    static column9of12(width: number): number {
        return DisplayUtil.column1of12(width) * 9;
    }

    static column10of12(width: number): number {
        return DisplayUtil.column1of12(width) * 10;
    }

    static column11of12(width: number): number {
        return DisplayUtil.column1of12(width) * 11;
    }
}