import { Card, CardHeader, Typography, CardBody, CardFooter, Chip, Avatar } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/user.context";
import ModifBtnStack from "../UIX/ModifBtnStack";
import { action, Flag, Service } from "../../types/class";
import { GenereMyActions, getLabel, GetPoints, isFlaged, isLate, serviceCategories, serviceStatus, serviceTypes, toggleResp } from "../../functions/GetDataFunctions";
import { deleteService } from "../../functions/API/servicesApi";
import { getFlagsService } from "../../functions/API/flagsApi";


export default function ServiceComp(props:
    { service: Service, mines?: boolean, change: (e: any) => void, update?: () => void }) {
    const { user } = useContext(UserContext)
    const userId = user.userId
    const { mines, change, update } = props
    const [service, setService] = useState<Service>(props.service)
    const { id, title, description, image, createdAt, User, UserResp } = service
    const [flagged, setFlagged] = useState<boolean>(false)
    const [flags, setFlags] = useState<Flag[]>([])
    const isMine = service.User.id === userId
    const IResp = UserResp?.id === userId
    // console.log(isMine, IResp)
    // console.log(userId, User.id, UserResp?.id)
    const haveImage = service.image ? true : false
    const type = getLabel(service.type, serviceTypes)
    const points = GetPoints(service, User.Profile)
    const category = getLabel(service.category, serviceCategories)
    const navigate = useNavigate();
    const late: boolean = isLate(createdAt, 15)
    const [status, setStatus] = useState<string>(getLabel(service.status, serviceStatus));
    const [isNew, setIsNew] = useState<boolean>(status === 'nouveau' ? true : false);
    const [isResp, setIsResp] = useState<boolean>(status === 'en attente' ? true : false);
    const [isValidated, setIsValidated] = useState<boolean>(status === 'en cours' ? true : false);
    const [isFinish, setIsFinish] = useState<boolean>(status === 'terminé' ? true : false);
    const updateStatusFlags = (status: string) => {
        setIsNew(status === 'nouveau');
        setIsResp(status === 'en attente');
        setIsValidated(status === 'en cours');
        setIsFinish(status === 'terminé');
    };

    useEffect(() => {
        const onload = async () => {
            const flags = await getFlagsService()
            setFlags(flags)
            setFlagged(isFlaged(service, userId, flags))
        }
        onload()
        setStatus(getLabel(service.status, serviceStatus));
        updateStatusFlags(status)
    }, [service])

    const myActions = GenereMyActions(service, "service", deleteService, undefined, late)
    const takenCTA: action[] = [
        {
            icon: "sync_problem", title: `litige sur  ${title}`,
            body: `litige a ${title}`,
            function: () => navigate({ pathname: `/litige/create/${id}` }),
        },
        {
            icon: "person_cancel", title: `annuler ma réponse à ${title}`,
            body: `annuler ma réponse à ${title}`,
            function: () => { toggleResp(service.id, userId, setService); update && update() },
        },
        {
            icon: "groups", title: `Relancer ${title}`,
            body: ` Relancer ${title}`,
            function: () => { alert(`Voulez-vous relancer ${type} ${id} ?`) },
        },
    ]


    return (
        <>
            <Card className={`CardFix  ${haveImage ? "!h-full " : "!h-[calc(100%+1.5rem)] -mt-6"}`}>
                <CardHeader className={haveImage ? "FixCardHeader" : "FixCardHeader NoImage"}
                    floated={haveImage}>
                    <div className={` ${haveImage && "absolute p-2"} h-max w-full flex justify-between`}>
                        <div className="flex items-start  md:items-center gap-2 mb-1">
                            <button onClick={(e: any) => { let cat = e.target.innerText.toLowerCase(); change(cat) }}>
                                <Chip value={`${category}`}
                                    className="rounded-full h-max text-ellipsis shadow " color="cyan">
                                </Chip>
                            </button>
                            <button onClick={(e: any) => { let cat = e.target.innerText.toLowerCase(); change(cat) }}>
                                <Chip value={type} className={`${type === "demande" ? "OrangeChip" : "GreenChip"} 
                                    rounded-full  h-max flex items-center gap-2 font-medium `}>
                                </Chip>
                            </button>
                        </div>
                        <div className="flex items-center gap-2 flex-col md:flex-row">
                            <Chip value={status}
                                className={`${isResp && "OrangeChip" || isValidated && "GreenChip" || isFinish && "GrayChip"} rounded-full h-max flex items-center gap-2 font-medium `}>
                            </Chip>
                            <Chip value={(new Date(createdAt)).toLocaleDateString('fr-FR')}
                                className={`${late ? "RedChip" : "GrayChip"} 
                                rounded-full  h-max flex items-center gap-2 shadow font-medium `}>
                            </Chip>
                        </div>
                    </div>
                    {image &&
                        <img
                            src={image as any}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    }
                </CardHeader>
                <CardBody className={` FixCardBody !flex-1`}>
                    <div className="flex sticky top-0 bg-white w-full items-center justify-between">
                        <Typography variant="h5" color="blue-gray">
                            {title}
                        </Typography>
                        <Link to={`/flag${flagged ? '/edit' : ''}/service${id}`} title={`signaler un problème sur ${title}`}>
                            <span className={`${flagged && "fill !text-red-500"} 
                                material-symbols-outlined !text-[1.2rem] opacity-80`}>flag_2
                            </span>
                        </Link>
                    </div>
                    <div className="flex flex-col h-full">
                        <div className="CardOverFlow">
                            <Typography color="blue-gray" variant="small">
                                {service.status === 1 ? "en attente" : service.status === 2 ? "en cours" : service.status === 3 ? "terminé" : "..."}
                            </Typography>
                            <Typography color="blue-gray" className="mb-2">
                                {description}...
                            </Typography>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="CardFooter">
                    {isMine && mines &&

                        <ModifBtnStack actions={myActions} icon3={late} update={update} />}

                    {IResp && mines &&
                        <ModifBtnStack actions={takenCTA} />}


                    {!mines && <div className="flex items-center px-0 gap-2">
                        <Avatar src={User.Profile?.image} size="sm" alt="avatar" withBorder={true} />
                        <div className=" lg:flex lg:flex-col">
                            <Typography variant="small" className="font-normal !p-0">{User.Profile?.firstName} - {User.Profile?.lastName}</Typography>
                            <Typography variant="small" color="gray" >
                                . {User.Profile?.skills}
                            </Typography>
                        </div>
                    </div>}

                    <div className="flex items-center gap-2">
                        <button onClick={() => { }} className={mines ? `hidden md:flex` : `flex`}>
                            <Chip value={`${points.join(' à ')}   pts`} size="lg" className=" GrayChip  lowercase !font-medium  rounded-full h-full flex items-center justify-center gap-5" icon=
                                {<span className={`${type === "offre" ? " !text-green-500" : "!text-orange-500"} 
                                ${user.points > points[0] && "fill"}  
                                material-symbols-outlined  flex items-center !text-[1.4rem]`}>fiber_manual_record
                                </span>}>
                            </Chip>
                        </button>

                        <Link to={`/service/${id}`} className="flex items-center gap-2" title={`voir les details de service  ${title}`}>
                            <span className="material-symbols-outlined fill !text-[3rem] text-gray-900  fillThin">
                                arrow_circle_right
                            </span>
                        </Link>
                    </div>
                </CardFooter>
            </Card >
        </>
    )
}