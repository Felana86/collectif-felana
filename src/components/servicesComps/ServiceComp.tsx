import { Card, CardHeader, Typography, CardBody, CardFooter, Chip, Avatar } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import ModifBtnStack from "../ModifBtnStack";
import { action, Profile, Service } from "../../types/class";
import { useContext } from "react";
import DataContext from "../../contexts/data.context";
import UserContext from "../../contexts/user.context";
import { GetCategory, GetPoints, isLate } from "../../functions/GetDataFunctions";


export default function ServiceComp(props:
    {
        service: Service,
        mines?: boolean,
        change: (e: any) => void,
        handleClickDelete: (id: number) => void,
        handleClickTake: (id: number) => void,
        isFlaged?: boolean
    }) {


    const { data } = useContext(DataContext);
    const { user } = useContext(UserContext)
    const { service, mines, change, handleClickDelete, handleClickTake, isFlaged } = props
    const { id, title, description, image, created_at, user_id } = props.service
    const haveImage = service.image ? true : false
    const userAuthor = data.profiles.find((user: Profile) => user.user_id === user_id)
    const type = service.type === "get" ? "demande" : "offre"
    const points = GetPoints(service, userAuthor)
    const category = GetCategory(service)
    const navigate = useNavigate();

    const late = isLate(created_at, 15)


    const takenCTA: action[] = [
        {
            icon: "sync_problem",
            title: `litige sur  ${title}`,
            body: `litige a ${title}`,
            function: () => navigate({ pathname: `/litige/create/${id}` }),
        },
        {
            icon: "person_cancel",
            title: `annuler ma réponse à ${title}`,
            body: `annuler ma réponse à ${title}`,
            function: () => { handleClickTake(id); console.log(id) },
        },
        {
            icon: "groups",
            title: `Relancer ${title}`,
            body: `annuler ma réponse à ${title}`,
            function: () => {
                alert(`Voulez-vous relancer ${type} ${id} ?`);
            },
        },
    ]

    return (
        <>
            <Card className={`CardFix  ${haveImage ? "!h-full " : "!h-[calc(100%+1.5rem)] -mt-6"}`}>
                <CardHeader className={haveImage ? "FixCardHeader" : "FixCardHeader NoImage"}
                    floated={haveImage}>
                    <div className={` ${haveImage && "absolute p-2"} h-max w-full flex justify-between `}>
                        <button onClick={(e: any) => change(e)}>

                            <div className="flex items-center gap-2 mb-1">
                                <Chip value={`${category}`} className="rounded-full h-max text-ellipsis shadow " color="cyan">
                                </Chip>

                                <Chip value={type} className={`${service.type === "get" ? "OrangeChip" : "GreenChip"} rounded-full  h-max flex items-center gap-2 font-medium `}>
                                </Chip>
                            </div>

                        </button>
                        <Chip value={(new Date(created_at)).toLocaleDateString('fr-FR')} className={`${late ? "RedChip" : "GrayChip"} rounded-full  h-max flex items-center gap-2 shadow font-medium `}>
                        </Chip>
                    </div>
                    {image &&
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    }
                </CardHeader>
                <CardBody className={` FixCardBody !flex-1`}>
                    <div className="flex sticky top-0 bg-white w-full items-center justify-between">
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            {title}
                        </Typography>

                        <Link to={`/flag${isFlaged ? '/edit' : ''}/service/${id}`} title={`signaler un problème sur ${title}`}>

                            <span className={`${isFlaged && "fill !text-red-500"} material-symbols-outlined !text-[1.2rem] opacity-80`}>flag_2</span>
                        </Link>

                    </div>
                    <div className="flex flex-col h-full">
                        <div className="CardOverFlow">

                            <Typography color="blue-gray" className="mb-2">
                                {description}...
                            </Typography></div>
                    </div>
                </CardBody>
                <CardFooter className="CardFooter">
                    {mines && userAuthor.id === user.id &&
                        <ModifBtnStack id={id} handleClickDelete={handleClickDelete} icon3={late} />}

                    {mines && userAuthor.id !== user.id &&

                        <ModifBtnStack id={id} values={takenCTA} />
                    }

                    {!mines && <div className="flex items-center px-0 gap-2">
                        <Avatar src={userAuthor?.avatar} size="sm" alt="avatar" withBorder={true} />
                        <div className="hidden lg:flex lg:flex-col">
                            <Typography variant="small" className="font-normal !p-0">{userAuthor?.firstName} - {userAuthor?.lastName}</Typography>
                            <Typography variant="small" color="gray" >
                                . {userAuthor?.skills?.join(', ')}
                            </Typography>
                        </div>
                    </div>}



                    <div className="flex items-center gap-2">
                        <button onClick={() => { }} className={mines ? `hidden md:flex` : `flex`}>
                            <Chip value={`${points.join(' à ')}   pts`} size="lg" className=" GrayChip  lowercase !font-medium  rounded-full h-full flex items-center justify-center gap-5"
                                icon={<span className={`${service.type === "do" ? " !text-green-500" : "!text-orange-500"} ${user.points > points[0] && "fill"}  material-symbols-outlined  flex items-center !text-[1.4rem]`}>fiber_manual_record</span>}>


                            </Chip></button>

                        <Link to={`/service/${id}`} className="flex items-center gap-2" title={`voir les details de service  ${title}`}><span className="material-symbols-outlined fill !text-[3rem] text-gray-900  fillThin">
                            arrow_circle_right
                        </span>
                        </Link>
                    </div>
                </CardFooter>
            </Card >
        </>
    )
}