type Community = {
    name: string;
    description: string;
    created_at: string;
    rules: string[];
  };
  
  export default function AboutCommunity({ community }: { community: Community }) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">About {community.name}</h3>
        <p>{community.description}</p>
        <p className="mt-2 text-gray-400">Created on: {new Date(community.created_at).toLocaleDateString()}</p>
        <h4 className="text-lg font-semibold mt-4 mb-2">Community Rules</h4>
        {/* <ul className="list-disc pl-5">
          {community.rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul> */}
      </div>
    );
  }