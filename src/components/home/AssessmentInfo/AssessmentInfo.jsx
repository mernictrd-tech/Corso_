import AssessmentCard from "./AssessmentCard";
import JobRolesCard from "./JobRolesCard";
import Container from "../../layout/Container";

const AssessmentInfo = () => {
  return (
    <section id="assessment-info" className="bg-[#070B1A] py-28">

      <Container>

        <div className="grid gap-8 lg:grid-cols-2">

          <AssessmentCard />

          <JobRolesCard />

        </div>

      </Container>

    </section>
  );
};

export default AssessmentInfo;