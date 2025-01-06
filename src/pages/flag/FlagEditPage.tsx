import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { Option, Button, Select, Switch } from '@material-tailwind/react';
import Skeleton from 'react-loading-skeleton';
import NavBarTop from '../../components/UIX/NavBarTop';
import SubHeader from '../../components/UIX/SubHeader';
import FlagDetailComp from '../../components/flagComps/FlagDetailComp';
import { ConfirmModal } from '../../components/UIX/ConfirmModal';
import { flagReasons, flagTargets, getLabel } from '../../functions/GetDataFunctions';
import { deleteFlag, getMyFlag } from '../../functions/API/flagsApi';
import { Flag, Label } from '../../types/class';

export default function FlagEditPage() {
    const { id, target } = useParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [flag, setFlag] = useState<Flag>({} as Flag)
    const label = getLabel(target, flagTargets)
    const navigate = useNavigate();

    const fetch = async () => {
        setLoading(true);
        const idS = id ? parseInt(id) : 0;
        const targetS = target ? target : "";
        const flag = await getMyFlag(targetS, idS);
        setFlag(flag);
        setLoading(false);
        formik.values.reason = flag.reason
        formik.values.target = flag.target
        formik.values.targetId = flag.targetId
    }
    useEffect(() => { fetch() }, []);
    const formSchema = object({ reason: string().required("Le type de signalement est obligatoire") })

    const formik = useFormik({
        initialValues: { ...flag } as Flag,
        validationSchema: formSchema,
        onSubmit: values => {
            setFlag(values)
            formik.values = values
            setOpen(true)

        }
    });

    const [open, setOpen] = useState(false);


    return (
        <div className="Body gray">
            <ConfirmModal
                open={open}
                handleOpen={() => setOpen(false)}
                handleCancel={() => { setOpen(false) }}
                handleConfirm={async () => {
                    const ok = await deleteFlag(flag.target.toString().toLowerCase(), flag.targetId)
                    if (ok) { setOpen(false); navigate('/flag') }
                }}
                title={`Confirmer la suppression`}
                element={`<br> Vous confirmez la suppression du signalement </br>
                sur  l'${label} pour le motif ${getLabel(flag.reason, flagReasons)}`} />
            <form onSubmit={formik.handleSubmit} className="flex flex-col h-full gap-2 pb-3">
                <header className="px-4">
                    <NavBarTop />
                    <SubHeader type={`Signaler `} place={'un ' + label} closeBtn />

                    <div className='w-respLarge h-full flex flex-col gap-2'>
                        <div className='flex justify-between items-center px-2'>
                            <Switch label={flag.reason ? "signalé" : "non signalé"} className='px-2' color='cyan' name="active" onChange={formik.handleChange} checked={flag.reason ? true : false} /></div>
                        <Select className={` rounded-full shadow bg-white border-none capitalize`}
                            label={formik.errors.reason ? formik.errors.reason as string : "Raison du signalement"}
                            name="reason"
                            labelProps={{ className: `${formik.errors.reason && "error"} before:border-none after:border-none ` }}
                            value={flag.reason as unknown as string || ''}
                            disabled={flag.reason ? true : false}
                            onChange={(val: any) => { formik.values.reason = val; }}
                        >
                            {flagReasons.map((reason: Label, index: number) => {
                                return (
                                    <Option className={reason.value === '' ? "hidden" : "rounded-full my-1 capitalize"} value={reason.value} key={index} >
                                        {reason.label}
                                    </Option>)
                            })}
                        </Select>
                    </div>
                </header>

                <main className='flex pb-2'>
                    {loading ? <Skeleton className='w-respLarge m-auto !h-full !rounded-3xl' /> : <FlagDetailComp flag={flag} />}
                </main>

                <footer className=" w-respLarge">
                    <Button type="submit" size="lg" className="w-full rounded-full" >
                        retirer mon signalement
                    </Button>
                </footer>
            </form>
        </div >
    )
}

