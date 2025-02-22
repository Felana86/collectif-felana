import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { Issue, IssueStep } from '../../../../../domain/entities/Issue';
import { Service, ServiceType } from '../../../../../domain/entities/Service';
import { User } from '../../../../../domain/entities/User';
import CTAMines from '../../../common/CTAMines';
import NavBarTop from '../../../common/NavBarTop';
import SubHeader from '../../../common/SubHeader';
import { IssueForm } from '../serviceCards/IssueCard';
import { Action } from '../../../../../domain/entities/frontEntities';
import { UserApi } from '../../../../../infrastructure/providers/http/userApi'
import { useUserStore } from '../../../../../application/stores/user.store';
import { Skeleton } from '../../../common/Skeleton';
import { ServiceApi } from '../../../../../infrastructure/providers/http/serviceApi';
import { IssueApi } from '../../../../../infrastructure/providers/http/IssueApi';


export default function IssueDetailPage() {
    const { id } = useParams()
    const { user } = useUserStore()
    const userId = user.id
    const [service, setService] = useState<Service>({} as Service)
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [issue, setIssue] = useState<Issue>({} as Issue);
    const [modos, setModos] = useState<User[]>([])
    const [statusValue, setStatusValue] = useState<number>(0);
    const { getIssueById, deleteIssue } = new IssueApi()
    const { getUsersModos } = new UserApi()
    const { getServiceById } = new ServiceApi()

    const fetch = async () => {
        const idS = id ? parseInt(id) : 0;
        const issue = await getIssueById(idS);
        const modos = await getUsersModos()
        const service = await getServiceById(idS)
        setIssue(issue);
        setService(issue.Service)
        issue && setLoading(false)
        setModos(modos)
        service && modos && setLoading(false)
        setStatusValue(parseInt(IssueStep[issue.status as number]));
    }

    const MyActions: Action[] = [{
        icon: statusValue < 1 ? 'En attente' : 'Conciliation en cours',
        title: 'Valider la conciliation',
        body: 'service.title as string,',
        function: () => { }
    },
    {
        icon: statusValue < 2 ? 'Supprimer la conciliation' : '',
        title: 'Supprimer la conciliation',
        body: 'service.title as string',
        function: async () => { const ok = await deleteIssue(issue.serviceId); ok && navigate('/service?search=myservices') }
    }]
    const RespActions = [
        {
            icon: statusValue < 2 && 'Valider mon modérateur' || statusValue === 2 && 'En cours de validation' || 'Finis',
            title: 'Valider mon modérateur',
            body: '--',
            function: () => { }
        }]

    useEffect(() => { fetch() }, []);


    return (
        <div className="Body gray">
            <header className="px-4">
                <NavBarTop />
                <SubHeader type={"Conciliation"} place={` sur ${issue.Service?.type === ServiceType.GET ? "une demande" : "une offre"} de service  ${userId === service.userId ? "que j'ai créé" : "à laquelle j'ai repondu"}`} closeBtn />
            </header>
            {loading ?
                <Skeleton className="w-respLarge !rounded-2xl !h-[calc(100vh-16rem)] shadow m-auto" /> :
                <IssueForm issue={issue} loading={loading} modos={modos} />
            }
            {userId === issue.userId ?
                <CTAMines actions={MyActions} disabled1={statusValue < 1} /> :
                <CTAMines actions={RespActions} disabled1={statusValue > 1} />
            }
        </div >
    )
}

