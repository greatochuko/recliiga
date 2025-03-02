
import { useState } from 'react';
import { LeagueCard } from './LeagueCard';
import { LeagueSelector } from './LeagueSelector';
import { ResultsLeaderboard } from './ResultsLeaderboard';
import { mockLeaguesData, columnExplanations } from './data';

export const ResultsContent = () => {
  const [selectedLeague, setSelectedLeague] = useState('premier-league');
  
  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div>
        <LeagueSelector 
          leaguesData={mockLeaguesData} 
          selectedLeague={selectedLeague} 
          setSelectedLeague={setSelectedLeague} 
        />
        
        <LeagueCard league={mockLeaguesData[selectedLeague]} />

        <ResultsLeaderboard 
          leagueData={mockLeaguesData[selectedLeague]} 
          columnExplanations={columnExplanations} 
        />
      </div>
    </div>
  );
};
