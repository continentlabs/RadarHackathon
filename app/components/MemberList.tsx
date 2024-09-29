type Member = {
    id: string;
    users: {
      name: string;
      avatar_url: string;
    };
  };
  
  export default function MemberList({ members }: { members: Member[] }) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Members</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center space-x-2">
              <span>{member.users.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }