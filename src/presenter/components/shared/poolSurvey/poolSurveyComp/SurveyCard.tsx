import { Card, CardHeader, CardBody, CardFooter, Typography, Chip } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Flag } from "../../../../../domain/entities/Flag";
import { Survey } from "../../../../../domain/entities/Survey";
import { Vote } from "../../../../../domain/entities/Vote";
import { SurveyService } from "../../../../../domain/repositoriesBase/SurveyRepository"
import { dayMS, getLabel, surveyCategories, GenereMyActions } from "../../../../../infrastructure/services/utilsService";
import ModifBtnStack from "../../../common/ModifBtnStack";
import { DateChip, ProgressSmallbar, Icon, Title } from "../../../common/SmallComps";
import { UserApi } from "../../../../../infrastructure/providers/http/userApi";
import { useUserStore } from "../../../../../application/stores/user.store";


type SurveyCardProps = { survey: Survey, change: () => void, mines?: boolean, update?: () => void }
export function SurveyCard(props: SurveyCardProps) {
    const { user } = useUserStore()
    const userId: number = user.id
    const [survey] = useState<Survey>(props.survey)
    const { id, title, description, createdAt, image } = survey
    const Votes: Vote[] = survey.Votes || []
    const { change, mines, update } = props
    const ImIn: boolean = Votes?.find((vote: Vote) => vote?.User?.id === userId) ? true : false
    const now = new Date(Date.now())
    const [usersLength, setUsersLength] = useState<number>(0)
    const OkVotes: Vote[] = Votes?.filter((vote: Vote) => vote.opinion as unknown as string === 'OK')
    const pourcent: number = Math.floor((OkVotes?.length) / usersLength * 100)
    const endDays: number = Math.floor((new Date(createdAt).getTime() + 15 * dayMS - (now.getTime())) / dayMS)
    const end = new Date(new Date(createdAt).getTime() + 15 * dayMS)
    const disabledEditCTA: boolean = pourcent >= 100 ? true : false
    const ended: boolean = pourcent < 100 && endDays <= 0 ? true : false
    const category: string = getLabel(survey.category, surveyCategories)
    const { deleteSurvey } = new SurveyService()
    const { getUsers } = new UserApi()
    const actions = GenereMyActions(survey, "survey", deleteSurvey)
    const haveImage = survey.image ? true : false
    const flagged: boolean = survey.Flags?.find((flag: Flag) => flag.userId === userId) ? true : false
    const [needed, setNeeded] = useState<number>(usersLength - (survey.Votes?.length || 0))

    useEffect(() => {
        const onload = async () => {
            const users = await getUsers()
            setUsersLength(users.length / 2)
            setNeeded(users.length / 2 - (survey.Votes?.length || 0))
        }
        onload()
    }, [survey])

    return (
        <Card className={haveImage ? "FixCard " : "FixCardNoImage  "}>
            <CardHeader className={haveImage ? "FixCardHeader" : "FixCardHeader NoImage"}
                floated={haveImage}>
                <div className={haveImage ? "ChipDiv" : "ChipDivNoImage"}>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { change() }}>
                            <Chip value='Sondage' size="sm" className="!px-3 min-w-max rounded-full h-max OrangeChip" ></Chip>
                        </button>
                        <Chip value={category} size="sm" className="CyanChip"></Chip>
                    </div>
                    <DateChip start={createdAt} ended={ended} end={end} prefix="finis dans" />
                </div>
                {image &&
                    <img
                        src={image as any}
                        alt={title}
                        className="h-full w-full object-cover"
                    />}
            </CardHeader>
            <CardBody className={` FixCardBody`}>
                <Title title={title} flagged={flagged} id={id} />

                <Typography color="blue-gray" className=" overflow-auto mb-2 pb-2">
                    {description}
                </Typography>


            </CardBody>
            <CardFooter className="CardFooter items-center gap-6">
                {!mines ?
                    <ProgressSmallbar value={pourcent} label="Votes" needed={needed} size="md" />
                    :
                    <ModifBtnStack disabled2={disabledEditCTA} actions={actions} update={update} />}
                <div className="flex items-center justify-between gap-2">
                    <Chip value={Votes?.length} variant="ghost"
                        className="min-w-max rounded-full px-4"
                        icon={<Icon
                            icon="smart_card_reader"
                            fill={ImIn} color={ImIn && "green" || ''}
                            size="xl"
                            title={`  ${Votes?.length} personnes ${ImIn ? `dont vous ` : ''} ont voté`}
                            style="-mt-1.5 pl-2.5" />}>
                    </Chip>
                    <Icon icon="arrow_circle_right" title={`voir les details de ${title}`} link={`/sondage/${id}`} fill size="4xl px-1" />
                </div>
            </CardFooter >
        </Card>
    );
}
