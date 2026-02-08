import { Link } from "react-router"
import ScoreCircle from "./ScoreCircle";

interface Props {
  resume: Resume
}

const ResumeCard = ({ resume }: Props) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;

  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in duration-200 max-[900px]:w-full" >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="text-black font-bold wrap-break-word">{companyName}</h2>
          <h3 className="text-lg wrap-break-word text-gray-500">{jobTitle}</h3>
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      <div className="gradient-border">
        <div className="w-full h-full">
          <img src={imagePath} alt="resume" className="w-full h-[350px] object-cover object-top" />
        </div>
      </div>
    </Link>
  )
}

export default ResumeCard
