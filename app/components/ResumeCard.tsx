import { Link } from "react-router"

interface Props {
  resume: Resume
}

const ResumeCard = ({ resume }: Props) => {
  const { id, companyName, jobTitle} = resume;

  return (
    <div>
      <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000" > 
        <div className="flex flex-col gap-2">
          <h2 className="text-black font-bold wrap-break-word">{companyName}</h2>
          <h3 className="text-lg wrap-break-word text-gray-500">{jobTitle}</h3>
        </div>

        <div className="shrink-0">
          
        </div>
      </Link>
    </div>
  )
}

export default ResumeCard
