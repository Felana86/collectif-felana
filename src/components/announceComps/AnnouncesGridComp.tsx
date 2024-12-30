import { Post } from '../../types/class';
import AnnouncesComp from "./AnnouncesComp";

export default function AnnouncesGridComp(props: { line: Post[], mines?: boolean, change: (e: any) => void, update?: () => void, view?: string, }) {
    const { line, mines, change, update } = props
    const short = "pt-8 row-span-5 h-full  !h-[45vh] ";
    const long = "pt-8 row-span-6 h-full  !h-[58vh] ";

    return (
        <>
            <div className={"grid grid-cols-[1fr_1fr] grid-rows-[(24*1fr)] gap-x-4 gap-y-2"}>
                {line[0] &&
                    <div className={line[0].image ? short : short}>
                        <AnnouncesComp post={line[0]} mines={mines} change={change} update={update} />
                    </div>}

                {line[1] &&
                    <div className={line[1].image ? long : long}>
                        <AnnouncesComp post={line[1]} mines={mines} change={change} update={update} />
                    </div>}
                {line[2] &&
                    <div className={line[2].image ? long : long}>
                        <AnnouncesComp post={line[2]} mines={mines} change={change} update={update} />
                    </div>}

                {line[3] &&
                    <div className={line[2].image ? short : short}>
                        <AnnouncesComp post={line[3]} mines={mines} change={change} update={update} />
                    </div>}
            </div >


        </>
    )
}