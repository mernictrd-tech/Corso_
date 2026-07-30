import ProgramCard from "./ProgramCard";
import EmptyState from "./EmptyState";

const ProgramTable = ({
  programs,
  onDelete,
  onEdit,
  onView,
  onAdd,
}) => {

  if (programs.length === 0) {
    return (
      <EmptyState
        onAdd={onAdd}
      />
    );
  }

  return (
    <div className="space-y-4">

      {programs.map((program) => (

        <ProgramCard
          key={program.id}
          program={program}
          onDelete={onDelete}
          onEdit={() => onEdit(program)}
          onView={() => onView(program)}
        />

      ))}

    </div>
  );
};

export default ProgramTable;