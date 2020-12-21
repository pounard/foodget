import { DataColumnSpec, DataQuery, SortOrder, TableDataProvider } from "../src/data";
import { App, Window } from "../src/app";
import { ActionBar } from "../src/container";
import { CellAlignment, CellSizing, Container, Signal } from "../src/core";
import { Label, RawHtml } from "../src/display";
import { Button } from "../src/form";
import { TableView } from "../src/table";

interface Color {
    readonly name: string;
    readonly hexcode: string;
}

class MyDataProvider implements TableDataProvider<Color> {
    /**
     * @inheritdoc
     */
    createRow(row: Container, item: Color) {
        row.addChild(new Label(item.name), CellSizing.Expand, CellAlignment.Left);
        row.addChild(new RawHtml(`<code>#${item.hexcode}</code>`), CellSizing.Expand, CellAlignment.Center);
        row.addChild(new RawHtml(`<img src="${colorImage(item.hexcode, 20, 20)}"/>`), CellSizing.Shrink, CellAlignment.Center);
    }

    /**
     * @inheritdoc
     */
    query(query: DataQuery<Color>) {
        // You could use fetch here.
        return (new Promise<Color[]>((resolve) => resolve(COLORS)))
            .then(colors => {
                let ret: Color[] | undefined;

                switch (query.sortColumn) {
                    case "name":
                        if (query.sortOrder === SortOrder.Desc) {
                            ret = colors.sort((a, b) => a.name.localeCompare(b.name, 'fr', {ignorePunctuation: true}));
                        } else {
                            ret = colors.sort((a, b) => b.name.localeCompare(a.name, 'fr', {ignorePunctuation: true}));
                        }
                        break;

                    case "hexcode":
                        if (query.sortOrder === SortOrder.Asc) {
                            ret = colors.sort((a, b) => a.hexcode.localeCompare(b.hexcode));
                        } else {
                            ret = colors.sort((a, b) => b.hexcode.localeCompare(a.hexcode));
                        }
                        break;

                    default:
                        ret = colors;
                }

                return {
                    count: ret.length,
                    sortColumn: query.sortColumn ?? "name",
                    sortOrder: query.sortOrder ?? SortOrder.Asc,
                    items: ret,
                };
            })
        ;
    }

    /**
     * @inheritdoc
     */
    getColumnSpec(): DataColumnSpec<Color>[] {
        return [{
            field: "name",
            label: "Color name",
            sortable: true,
        }, {
            field: "hexcode",
            label: "CSS hexcode",
            sortable: true,
        }, {
            field: "display",
            label: "Sample",
        }];
    }
}

export function createTableViewDemo(app: App): void {
    const window = new Window("TableView example");
    const table = new TableView<Color>(new MyDataProvider());

    const actionBar = new ActionBar();
    const actionBarLabel = new Label(`This tableview is not loaded yet.`);
    actionBar.addChild(actionBarLabel);

    const closeButton = new Button("Close");
    closeButton.connect(Signal.Clicked, () => app.disposeCurrent())
    actionBar.addChild(closeButton)

    window.addChild(actionBar);
    window.addChild(table);
    app.addChild(window);

    // Always trigger the initial load manually?
    table.connect(Signal.TableDataRefreshed, (table) => {
        const response = table.getCurrentResponse();
        const currentPage = response.page ?? 1;
        const totalPageCount = Math.ceil((response.total ?? 1) / (response.limit ?? response.count));
        actionBarLabel.setLabel(`This TableView displays ${response.count} / ${response.total ?? response.count} items, in page ${currentPage} / ${totalPageCount}`);
    });
    table.refresh();
    app.display(window);
}

function colorImage(hexcode: string, width: number, height: number): string {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw "Could not create canvas context";
    }
    ctx.fillStyle = `#${hexcode}`
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();
}

const COLORS = [{
    "name": "Absolute Zero",
    "hexcode": "0048BA"
}, {
    "name": "Acid green",
    "hexcode": "B0BF1A"
}, {
    "name": "Aero",
    "hexcode": "7CB9E8"
}, {
    "name": "Aero blue",
    "hexcode": "C0E8D5"
}, {
    "name": "African violet",
    "hexcode": "B284BE"
}, {
    "name": "Air superiority blue",
    "hexcode": "72A0C1"
}, {
    "name": "Alabaster",
    "hexcode": "EDEAE0"
}, {
    "name": "Alice blue",
    "hexcode": "F0F8FF"
}, {
    "name": "Alloy orange",
    "hexcode": "C46210"
}, {
    "name": "Almond",
    "hexcode": "EFDECD"
}, {
    "name": "Amaranth",
    "hexcode": "E52B50"
}, {
    "name": "Amaranth (M&P)",
    "hexcode": "9F2B68"
}, {
    "name": "Amaranth pink",
    "hexcode": "F19CBB"
}, {
    "name": "Amaranth purple",
    "hexcode": "AB274F"
}, {
    "name": "Amaranth red",
    "hexcode": "D3212D"
}, {
    "name": "Amazon",
    "hexcode": "3B7A57"
}, {
    "name": "Amber",
    "hexcode": "FFBF00"
}, {
    "name": "Amber (SAE/ECE)",
    "hexcode": "FF7E00"
}, {
    "name": "Amethyst",
    "hexcode": "9966CC"
}, {
    "name": "Android green",
    "hexcode": "A4C639"
}, {
    "name": "Antique brass",
    "hexcode": "CD9575"
}, {
    "name": "Antique bronze",
    "hexcode": "665D1E"
}, {
    "name": "Antique fuchsia",
    "hexcode": "915C83"
}, {
    "name": "Antique ruby",
    "hexcode": "841B2D"
}, {
    "name": "Antique white",
    "hexcode": "FAEBD7"
}, {
    "name": "Ao (English)",
    "hexcode": "008000"
}, {
    "name": "Apple green",
    "hexcode": "8DB600"
}, {
    "name": "Apricot",
    "hexcode": "FBCEB1"
}, {
    "name": "Aqua",
    "hexcode": "00FFFF"
}, {
    "name": "Aquamarine",
    "hexcode": "7FFFD4"
}, {
    "name": "Arctic lime",
    "hexcode": "D0FF14"
}, {
    "name": "Army green",
    "hexcode": "4B5320"
}, {
    "name": "Artichoke",
    "hexcode": "8F9779"
}, {
    "name": "Arylide yellow",
    "hexcode": "E9D66B"
}, {
    "name": "Ash gray",
    "hexcode": "B2BEB5"
}, {
    "name": "Asparagus",
    "hexcode": "87A96B"
}, {
    "name": "Atomic tangerine",
    "hexcode": "FF9966"
}, {
    "name": "Auburn",
    "hexcode": "A52A2A"
}, {
    "name": "Aureolin",
    "hexcode": "FDEE00"
}, {
    "name": "Avocado",
    "hexcode": "568203"
}, {
    "name": "Azure",
    "hexcode": "007FFF"
}, {
    "name": "Azure (X11/web color)",
    "hexcode": "F0FFFF"
}, {
    "name": "Baby blue",
    "hexcode": "89CFF0"
}, {
    "name": "Baby blue eyes",
    "hexcode": "A1CAF1"
}, {
    "name": "Baby pink",
    "hexcode": "F4C2C2"
}, {
    "name": "Baby powder",
    "hexcode": "FEFEFA"
}, {
    "name": "Baker-Miller pink",
    "hexcode": "FF91AF"
}, {
    "name": "Banana Mania",
    "hexcode": "FAE7B5"
}, {
    "name": "Barbie Pink",
    "hexcode": "DA1884"
}, {
    "name": "Barn red",
    "hexcode": "7C0A02"
}, {
    "name": "Battleship grey",
    "hexcode": "848482"
}, {
    "name": "Beau blue",
    "hexcode": "BCD4E6"
}, {
    "name": "Beaver",
    "hexcode": "9F8170"
}, {
    "name": "Beige",
    "hexcode": "F5F5DC"
}, {
    "name": "B'dazzled blue",
    "hexcode": "2E5894"
}, {
    "name": "Big dip o’ruby",
    "hexcode": "9C2542"
}, {
    "name": "Bisque",
    "hexcode": "FFE4C4"
}, {
    "name": "Bistre",
    "hexcode": "3D2B1F"
}, {
    "name": "Bistre brown",
    "hexcode": "967117"
}, {
    "name": "Bitter lemon",
    "hexcode": "CAE00D"
}, {
    "name": "Bitter lime",
    "hexcode": "BFFF00"
}, {
    "name": "Bittersweet",
    "hexcode": "FE6F5E"
}, {
    "name": "Bittersweet shimmer",
    "hexcode": "BF4F51"
}, {
    "name": "Black",
    "hexcode": "000000"
}, {
    "name": "Black bean",
    "hexcode": "3D0C02"
}, {
    "name": "Black chocolate",
    "hexcode": "1B1811"
}, {
    "name": "Black coffee",
    "hexcode": "3B2F2F"
}, {
    "name": "Black coral",
    "hexcode": "54626F"
}, {
    "name": "Black olive",
    "hexcode": "3B3C36"
}, {
    "name": "Black Shadows",
    "hexcode": "BFAFB2"
}, {
    "name": "Blanched almond",
    "hexcode": "FFEBCD"
}, {
    "name": "Blast-off bronze",
    "hexcode": "A57164"
}, {
    "name": "Bleu de France",
    "hexcode": "318CE7"
}, {
    "name": "Blizzard blue",
    "hexcode": "ACE5EE"
}, {
    "name": "Blond",
    "hexcode": "FAF0BE"
}, {
    "name": "Blood red",
    "hexcode": "660000"
}, {
    "name": "Blue",
    "hexcode": "0000FF"
}, {
    "name": "Blue (Crayola)",
    "hexcode": "1F75FE"
}, {
    "name": "Blue (Munsell)",
    "hexcode": "0093AF"
}, {
    "name": "Blue (NCS)",
    "hexcode": "0087BD"
}, {
    "name": "Blue (Pantone)",
    "hexcode": "0018A8"
}, {
    "name": "Blue (pigment)",
    "hexcode": "333399"
}, {
    "name": "Blue (RYB)",
    "hexcode": "0247FE"
}, {
    "name": "Blue bell",
    "hexcode": "A2A2D0"
}, {
    "name": "Blue-gray",
    "hexcode": "6699CC"
}, {
    "name": "Blue-green",
    "hexcode": "0D98BA"
}, {
    "name": "Blue-green (color wheel)",
    "hexcode": "064E40"
}, {
    "name": "Blue jeans",
    "hexcode": "5DADEC"
}, {
    "name": "Blue sapphire",
    "hexcode": "126180"
}, {
    "name": "Blue-violet",
    "hexcode": "8A2BE2"
}, {
    "name": "Blue-violet (Crayola)",
    "hexcode": "7366BD"
}, {
    "name": "Blue-violet (color wheel)",
    "hexcode": "4D1A7F"
}, {
    "name": "Blue yonder",
    "hexcode": "5072A7"
}, {
    "name": "Bluetiful",
    "hexcode": "3C69E7"
}, {
    "name": "Blush",
    "hexcode": "DE5D83"
}, {
    "name": "Bole",
    "hexcode": "79443B"
}, {
    "name": "Bone",
    "hexcode": "E3DAC9"
}, {
    "name": "Bottle green",
    "hexcode": "006A4E"
}, {
    "name": "Brandy",
    "hexcode": "87413F"
}, {
    "name": "Brick red",
    "hexcode": "CB4154"
}, {
    "name": "Bright green",
    "hexcode": "66FF00"
}, {
    "name": "Bright lilac",
    "hexcode": "D891EF"
}, {
    "name": "Bright maroon",
    "hexcode": "C32148"
}, {
    "name": "Bright navy blue",
    "hexcode": "1974D2"
}, {
    "name": "Bright yellow (Crayola)",
    "hexcode": "FFAA1D"
}, {
    "name": "Brilliant rose",
    "hexcode": "FF55A3"
}, {
    "name": "Brink pink",
    "hexcode": "FB607F"
}, {
    "name": "British racing green",
    "hexcode": "004225"
}, {
    "name": "Bronze",
    "hexcode": "CD7F32"
}, {
    "name": "Brown",
    "hexcode": "88540B"
}, {
    "name": "Brown sugar",
    "hexcode": "AF6E4D"
}, {
    "name": "Brunswick green",
    "hexcode": "1B4D3E"
}, {
    "name": "Bud green",
    "hexcode": "7BB661"
}, {
    "name": "Buff",
    "hexcode": "FFC680"
}, {
    "name": "Burgundy",
    "hexcode": "800020"
}, {
    "name": "Burlywood",
    "hexcode": "DEB887"
}, {
    "name": "Burnished brown",
    "hexcode": "A17A74"
}, {
    "name": "Burnt orange",
    "hexcode": "CC5500"
}, {
    "name": "Burnt sienna",
    "hexcode": "E97451"
}, {
    "name": "Burnt umber",
    "hexcode": "8A3324"
}, {
    "name": "Byzantine",
    "hexcode": "BD33A4"
}, {
    "name": "Byzantium",
    "hexcode": "702963"
}, {
    "name": "Cadet",
    "hexcode": "536872"
}, {
    "name": "Cadet blue",
    "hexcode": "5F9EA0"
}, {
    "name": "Cadet blue (Crayola)",
    "hexcode": "A9B2C3"
}, {
    "name": "Cadet grey",
    "hexcode": "91A3B0"
}, {
    "name": "Cadmium green",
    "hexcode": "006B3C"
}, {
    "name": "Cadmium orange",
    "hexcode": "ED872D"
}, {
    "name": "Cadmium red",
    "hexcode": "E30022"
}, {
    "name": "Cadmium yellow",
    "hexcode": "FFF600"
}, {
    "name": "Café au lait",
    "hexcode": "A67B5B"
}, {
    "name": "Café noir",
    "hexcode": "4B3621"
}, {
    "name": "Cambridge blue",
    "hexcode": "A3C1AD"
}, {
    "name": "Camel",
    "hexcode": "C19A6B"
}, {
    "name": "Cameo pink",
    "hexcode": "EFBBCC"
}, {
    "name": "Canary",
    "hexcode": "FFFF99"
}, {
    "name": "Canary yellow",
    "hexcode": "FFEF00"
}, {
    "name": "Candy apple red",
    "hexcode": "FF0800"
}, {
    "name": "Candy pink",
    "hexcode": "E4717A"
}, {
    "name": "Capri",
    "hexcode": "00BFFF"
}, {
    "name": "Caput mortuum",
    "hexcode": "592720"
}, {
    "name": "Cardinal",
    "hexcode": "C41E3A"
}, {
    "name": "Caribbean green",
    "hexcode": "00CC99"
}, {
    "name": "Carmine",
    "hexcode": "960018"
}, {
    "name": "Carmine (M&P)",
    "hexcode": "D70040"
}, {
    "name": "Carnation pink",
    "hexcode": "FFA6C9"
}, {
    "name": "Carnelian",
    "hexcode": "B31B1B"
}, {
    "name": "Carolina blue",
    "hexcode": "56A0D3"
}, {
    "name": "Carrot orange",
    "hexcode": "ED9121"
}, {
    "name": "Castleton green",
    "hexcode": "00563F"
}, {
    "name": "Catawba",
    "hexcode": "703642"
}, {
    "name": "Cedar Chest",
    "hexcode": "C95A49"
}, {
    "name": "Celadon",
    "hexcode": "ACE1AF"
}, {
    "name": "Celadon blue",
    "hexcode": "007BA7"
}, {
    "name": "Celadon green",
    "hexcode": "2F847C"
}, {
    "name": "Celeste",
    "hexcode": "B2FFFF"
}, {
    "name": "Celtic blue",
    "hexcode": "246BCE"
}, {
    "name": "Cerise",
    "hexcode": "DE3163"
}, {
    "name": "Cerulean",
    "hexcode": "007BA7"
}, {
    "name": "Cerulean blue",
    "hexcode": "2A52BE"
}, {
    "name": "Cerulean frost",
    "hexcode": "6D9BC3"
}, {
    "name": "Cerulean (Crayola)",
    "hexcode": "1DACD6"
}, {
    "name": "CG blue",
    "hexcode": "007AA5"
}, {
    "name": "CG red",
    "hexcode": "E03C31"
}, {
    "name": "Champagne",
    "hexcode": "F7E7CE"
}, {
    "name": "Champagne pink",
    "hexcode": "F1DDCF"
}, {
    "name": "Charcoal",
    "hexcode": "36454F"
}, {
    "name": "Charleston green",
    "hexcode": "232B2B"
}, {
    "name": "Charm pink",
    "hexcode": "E68FAC"
}, {
    "name": "Chartreuse (traditional)",
    "hexcode": "DFFF00"
}, {
    "name": "Chartreuse (web)",
    "hexcode": "7FFF00"
}, {
    "name": "Cherry blossom pink",
    "hexcode": "FFB7C5"
}, {
    "name": "Chestnut",
    "hexcode": "954535"
}, {
    "name": "Chili red",
    "hexcode": "E23D28"
}, {
    "name": "China pink",
    "hexcode": "DE6FA1"
}, {
    "name": "China rose",
    "hexcode": "A8516E"
}, {
    "name": "Chinese red",
    "hexcode": "AA381E"
}, {
    "name": "Chinese violet",
    "hexcode": "856088"
}, {
    "name": "Chinese yellow",
    "hexcode": "FFB200"
}, {
    "name": "Chocolate (traditional)",
    "hexcode": "7B3F00"
}, {
    "name": "Chocolate (web)",
    "hexcode": "D2691E"
}, {
    "name": "Chocolate Cosmos",
    "hexcode": "58111A"
}, {
    "name": "Chrome yellow",
    "hexcode": "FFA700"
}, {
    "name": "Cinereous",
    "hexcode": "98817B"
}, {
    "name": "Cinnabar",
    "hexcode": "E34234"
}, {
    "name": "Cinnamon Satin",
    "hexcode": "CD607E"
}, {
    "name": "Citrine",
    "hexcode": "E4D00A"
}, {
    "name": "Citron",
    "hexcode": "9FA91F"
}, {
    "name": "Claret",
    "hexcode": "7F1734"
}, {
    "name": "Cobalt blue",
    "hexcode": "0047AB"
}, {
    "name": "Cocoa brown",
    "hexcode": "D2691E"
}, {
    "name": "Coffee",
    "hexcode": "6F4E37"
}, {
    "name": "Columbia Blue",
    "hexcode": "B9D9EB"
}, {
    "name": "Congo pink",
    "hexcode": "F88379"
}, {
    "name": "Cool grey",
    "hexcode": "8C92AC"
}, {
    "name": "Copper",
    "hexcode": "B87333"
}, {
    "name": "Copper (Crayola)",
    "hexcode": "DA8A67"
}, {
    "name": "Copper penny",
    "hexcode": "AD6F69"
}, {
    "name": "Copper red",
    "hexcode": "CB6D51"
}, {
    "name": "Copper rose",
    "hexcode": "996666"
}, {
    "name": "Coquelicot",
    "hexcode": "FF3800"
}, {
    "name": "Coral",
    "hexcode": "FF7F50"
}, {
    "name": "Coral pink",
    "hexcode": "F88379"
}, {
    "name": "Cordovan",
    "hexcode": "893F45"
}, {
    "name": "Corn",
    "hexcode": "FBEC5D"
}, {
    "name": "Cornell red",
    "hexcode": "B31B1B"
}, {
    "name": "Cornflower blue",
    "hexcode": "6495ED"
}, {
    "name": "Cornsilk",
    "hexcode": "FFF8DC"
}, {
    "name": "Cosmic cobalt",
    "hexcode": "2E2D88"
}, {
    "name": "Cosmic latte",
    "hexcode": "FFF8E7"
}, {
    "name": "Coyote brown",
    "hexcode": "81613C"
}, {
    "name": "Cotton candy",
    "hexcode": "FFBCD9"
}, {
    "name": "Cream",
    "hexcode": "FFFDD0"
}, {
    "name": "Crimson",
    "hexcode": "DC143C"
}, {
    "name": "Crimson (UA)",
    "hexcode": "9E1B32"
}, {
    "name": "Crystal",
    "hexcode": "A7D8DE"
}, {
    "name": "Cultured",
    "hexcode": "F5F5F5"
}, {
    "name": "Cyan",
    "hexcode": "00FFFF"
}, {
    "name": "Cyan (process)",
    "hexcode": "00B7EB"
}, {
    "name": "Cyber grape",
    "hexcode": "58427C"
}, {
    "name": "Cyber yellow",
    "hexcode": "FFD300"
}, {
    "name": "Cyclamen",
    "hexcode": "F56FA1"
}, {
    "name": "Dark blue-gray",
    "hexcode": "666699"
}, {
    "name": "Dark brown",
    "hexcode": "654321"
}, {
    "name": "Dark byzantium",
    "hexcode": "5D3954"
}, {
    "name": "Dark cornflower blue",
    "hexcode": "26428B"
}, {
    "name": "Dark cyan",
    "hexcode": "008B8B"
}, {
    "name": "Dark electric blue",
    "hexcode": "536878"
}, {
    "name": "Dark goldenrod",
    "hexcode": "B8860B"
}, {
    "name": "Dark green",
    "hexcode": "013220"
}, {
    "name": "Dark green (X11)",
    "hexcode": "006400"
}, {
    "name": "Dark jungle green",
    "hexcode": "1A2421"
}, {
    "name": "Dark khaki",
    "hexcode": "BDB76B"
}, {
    "name": "Dark lava",
    "hexcode": "483C32"
}, {
    "name": "Dark liver",
    "hexcode": "534B4F"
}, {
    "name": "Dark liver (horses)",
    "hexcode": "543D37"
}, {
    "name": "Dark magenta",
    "hexcode": "8B008B"
}, {
    "name": "Dark moss green",
    "hexcode": "4A5D23"
}, {
    "name": "Dark olive green",
    "hexcode": "556B2F"
}, {
    "name": "Dark orange",
    "hexcode": "FF8C00"
}, {
    "name": "Dark orchid",
    "hexcode": "9932CC"
}, {
    "name": "Dark pastel green",
    "hexcode": "03C03C"
}, {
    "name": "Dark purple",
    "hexcode": "301934"
}, {
    "name": "Dark red",
    "hexcode": "8B0000"
}, {
    "name": "Dark salmon",
    "hexcode": "E9967A"
}, {
    "name": "Dark sea green",
    "hexcode": "8FBC8F"
}, {
    "name": "Dark sienna",
    "hexcode": "3C1414"
}, {
    "name": "Dark sky blue",
    "hexcode": "8CBED6"
}, {
    "name": "Dark slate blue",
    "hexcode": "483D8B"
}, {
    "name": "Dark slate gray",
    "hexcode": "2F4F4F"
}, {
    "name": "Dark spring green",
    "hexcode": "177245"
}, {
    "name": "Dark turquoise",
    "hexcode": "00CED1"
}, {
    "name": "Dark violet",
    "hexcode": "9400D3"
}, {
    "name": "Dartmouth green",
    "hexcode": "00703C"
}, {
    "name": "Davy's grey",
    "hexcode": "555555"
}, {
    "name": "Deep cerise",
    "hexcode": "DA3287"
}, {
    "name": "Deep champagne",
    "hexcode": "FAD6A5"
}, {
    "name": "Deep chestnut",
    "hexcode": "B94E48"
}, {
    "name": "Deep jungle green",
    "hexcode": "004B49"
}, {
    "name": "Deep pink",
    "hexcode": "FF1493"
}, {
    "name": "Deep saffron",
    "hexcode": "FF9933"
}, {
    "name": "Deep sky blue",
    "hexcode": "00BFFF"
}, {
    "name": "Deep Space Sparkle",
    "hexcode": "4A646C"
}, {
    "name": "Deep taupe",
    "hexcode": "7E5E60"
}, {
    "name": "Denim",
    "hexcode": "1560BD"
}, {
    "name": "Denim blue",
    "hexcode": "2243B6"
}, {
    "name": "Desert",
    "hexcode": "C19A6B"
}, {
    "name": "Desert sand",
    "hexcode": "EDC9AF"
}, {
    "name": "Dim gray",
    "hexcode": "696969"
}, {
    "name": "Dodger blue",
    "hexcode": "1E90FF"
}, {
    "name": "Dogwood rose",
    "hexcode": "D71868"
}, {
    "name": "Drab",
    "hexcode": "967117"
}, {
    "name": "Duke blue",
    "hexcode": "00009C"
}, {
    "name": "Dutch white",
    "hexcode": "EFDFBB"
}, {
    "name": "Earth yellow",
    "hexcode": "E1A95F"
}, {
    "name": "Ebony",
    "hexcode": "555D50"
}, {
    "name": "Ecru",
    "hexcode": "C2B280"
}, {
    "name": "Eerie black",
    "hexcode": "1B1B1B"
}, {
    "name": "Eggplant",
    "hexcode": "614051"
}, {
    "name": "Eggshell",
    "hexcode": "F0EAD6"
}, {
    "name": "Egyptian blue",
    "hexcode": "1034A6"
}, {
    "name": "Eigengrau",
    "hexcode": "16161D"
}, {
    "name": "Electric blue",
    "hexcode": "7DF9FF"
}, {
    "name": "Electric green",
    "hexcode": "00FF00"
}, {
    "name": "Electric indigo",
    "hexcode": "6F00FF"
}, {
    "name": "Electric lime",
    "hexcode": "CCFF00"
}, {
    "name": "Electric purple",
    "hexcode": "BF00FF"
}, {
    "name": "Electric violet",
    "hexcode": "8F00FF"
}, {
    "name": "Emerald",
    "hexcode": "50C878"
}, {
    "name": "Eminence",
    "hexcode": "6C3082"
}, {
    "name": "English green",
    "hexcode": "1B4D3E"
}, {
    "name": "English lavender",
    "hexcode": "B48395"
}, {
    "name": "English red",
    "hexcode": "AB4B52"
}, {
    "name": "English vermillion",
    "hexcode": "CC474B"
}, {
    "name": "English violet",
    "hexcode": "563C5C"
}, {
    "name": "Erin",
    "hexcode": "00FF40"
}, {
    "name": "Eton blue",
    "hexcode": "96C8A2"
}, {
    "name": "Fallow",
    "hexcode": "C19A6B"
}, {
    "name": "Falu red",
    "hexcode": "801818"
}, {
    "name": "Fandango",
    "hexcode": "B53389"
}, {
    "name": "Fandango pink",
    "hexcode": "DE5285"
}, {
    "name": "Fashion fuchsia",
    "hexcode": "F400A1"
}, {
    "name": "Fawn",
    "hexcode": "E5AA70"
}, {
    "name": "Feldgrau",
    "hexcode": "4D5D53"
}, {
    "name": "Fern green",
    "hexcode": "4F7942"
}, {
    "name": "Field drab",
    "hexcode": "6C541E"
}, {
    "name": "Fiery rose",
    "hexcode": "FF5470"
}, {
    "name": "Firebrick",
    "hexcode": "B22222"
}, {
    "name": "Fire engine red",
    "hexcode": "CE2029"
}, {
    "name": "Fire opal",
    "hexcode": "E95C4B"
}, {
    "name": "Flame",
    "hexcode": "E25822"
}, {
    "name": "Flax",
    "hexcode": "EEDC82"
}, {
    "name": "Flirt",
    "hexcode": "A2006D"
}, {
    "name": "Floral white",
    "hexcode": "FFFAF0"
}, {
    "name": "Fluorescent blue",
    "hexcode": "15F4EE"
}, {
    "name": "Forest green (Crayola)",
    "hexcode": "5FA777"
}, {
    "name": "Forest green (traditional)",
    "hexcode": "014421"
}, {
    "name": "Forest green (web)",
    "hexcode": "228B22"
}, {
    "name": "French beige",
    "hexcode": "A67B5B"
}, {
    "name": "French bistre",
    "hexcode": "856D4D"
}, {
    "name": "French blue",
    "hexcode": "0072BB"
}, {
    "name": "French fuchsia",
    "hexcode": "FD3F92"
}, {
    "name": "French lilac",
    "hexcode": "86608E"
}, {
    "name": "French lime",
    "hexcode": "9EFD38"
}, {
    "name": "French mauve",
    "hexcode": "D473D4"
}, {
    "name": "French pink",
    "hexcode": "FD6C9E"
}, {
    "name": "French raspberry",
    "hexcode": "C72C48"
}, {
    "name": "French rose",
    "hexcode": "F64A8A"
}, {
    "name": "French sky blue",
    "hexcode": "77B5FE"
}, {
    "name": "French violet",
    "hexcode": "8806CE"
}, {
    "name": "Frostbite",
    "hexcode": "E936A7"
}, {
    "name": "Fuchsia",
    "hexcode": "FF00FF"
}, {
    "name": "Fuchsia (Crayola)",
    "hexcode": "C154C1"
}, {
    "name": "Fuchsia purple",
    "hexcode": "CC397B"
}, {
    "name": "Fuchsia rose",
    "hexcode": "C74375"
}, {
    "name": "Fulvous",
    "hexcode": "E48400"
}, {
    "name": "Fuzzy Wuzzy",
    "hexcode": "87421F"
}];
