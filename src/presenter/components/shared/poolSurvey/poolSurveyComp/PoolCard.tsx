import { Card, CardHeader, CardBody, CardFooter, Typography, Chip } from "@material-tailwind/react";
import { Vote } from "../../../../../domain/entities/Vote";
import { Icon } from '../../../common/SmallComps'
import { useContext, useState, useEffect } from "react";
import UserContext from "../../../../../contexts/user.context";
import { Pool } from "../../../../../domain/entities/Pool";
import { Profile } from "../../../../../domain/entities/Profile";
import { PoolService } from "../../../../../domain/repositories-ports/PoolRepository";
import { dayMS, GenereMyActions } from "../../../../../infrastructure/services/utilsService";
import ModifBtnStack from "../../../common/ModifBtnStack";
import { DateChip, ProfileDiv, ProgressSmallbar } from "../../../common/SmallComps";
import { Action } from "../../../../../domain/entities/frontEntities";
import { UserRepositoryImpl } from "../../../../../infrastructure/repositoriesImpl/UserRespositoryImpl";
import { UserApi } from "../../../../../infrastructure/providers/http/userApi";



type PoolCardProps = { pool: Pool, change: (e: any) => void, mines?: boolean, update?: () => void }
export function PoolCard(props: PoolCardProps) {
    const { userProfile } = useContext(UserContext)
    const userId: number = userProfile.userId
    const [pool] = useState<Pool>(props.pool)
    const { id, title, description, createdAt, UserBenef } = pool
    const Votes: Vote[] = pool.Votes || []
    const { change, mines, update } = props
    const ImIn: boolean = Votes?.find((vote: Vote) => vote?.User?.id === userId) ? true : false
    const now = new Date(Date.now())
    const [usersLength, setUsersLength] = useState<number>(0)
    const OkVotes = Votes?.filter((vote: Vote) => vote.opinion as unknown as string === 'OK')
    const pourcent: number = Math.floor((OkVotes?.length) / usersLength * 100)
    const endDays: number = Math.floor((new Date(createdAt).getTime() + 15 * dayMS - (now.getTime())) / dayMS)
    const ended: boolean = pourcent < 100 && endDays <= 0 ? true : false
    const end: Date = new Date(new Date(createdAt).getTime() + 15 * dayMS)
    const disabledEditCTA: boolean = pourcent >= 100 ? true : false
    const { deletePool } = new PoolService()
    const { getUsers } = new UserRepositoryImpl(new UserApi())

    const actions: Action[] = GenereMyActions(pool, "pool", deletePool)
    const [needed, setNeeded] = useState<number>(usersLength - (OkVotes?.length || 0))

    useEffect(() => {
        const onload = async () => {
            const users = await getUsers()
            setUsersLength(users.length / 2)
            setNeeded(users.length / 2 - (pool.Votes?.length || 0))
        }
        onload()
    }, [pool])

    return (
        <Card className={`CardFix  !h-[calc(100%+1.5rem)] -mt-6`}>
            <CardHeader className={"FixCardHeader NoImage"}
                floated={false}>
                <div className={` gap-4 h-full w-full flex justify-between `}>
                    <button onClick={(e: any) => change(e)} className="flex items-center gap-2">
                        <Chip value='Cagnotte' className="rounded-full h-max GreenChip" ></Chip>
                    </button>
                    <DateChip start={createdAt} ended={ended} end={end} prefix="finis dans" />
                </div>
            </CardHeader>
            <CardBody className="FixCardBody !flex-1">
                <div className="flex sticky top-0 bg-white w-full items-center justify-between">
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        {title}
                    </Typography>
                </div>
                <div className="flex flex-col h-full justify-between pb-6">
                    <div className="CardOverFlow  ">
                        <Typography color="blue-gray" className="mb-2">
                            {description}...
                        </Typography>
                    </div>
                    <ProfileDiv profile={UserBenef?.Profile || {} as Profile} size={'xl'} />
                </div>
            </CardBody>
            <CardFooter className="CardFooter items-center gap-6">
                {!mines ?
                    <ProgressSmallbar value={pourcent} label="Votes pour" needed={needed} size="md" />
                    :
                    <ModifBtnStack disabled2={disabledEditCTA} actions={actions} update={update} />}
                <div className="flex items-center justify-between gap-2">
                    <Chip value={Votes?.length} variant="ghost" className="rounded-full h-max flex items-center gap-2"
                        icon={<Icon icon="smart_card_reader" fill={ImIn} color={ImIn && "green" || ''} size="xl" title={`  ${Votes?.length} personnes ${ImIn ? `dont vous ` : ''} ont voté`} style="-mt-1 pl-1" />}>
                    </Chip>
                    <Icon icon="arrow_circle_right" title={`voir les details de ${title}`} link={`/cagnotte/${id}`} fill size="4xl px-1" />
                </div>
            </CardFooter >
        </Card >
    );
}