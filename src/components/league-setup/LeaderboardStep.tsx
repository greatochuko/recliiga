
import { useState } from 'react';
import { Plus, Minus, Edit, Save, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeaderboardStep({ leagueData, updateLeagueData }) {
  const [tieLinkedToWin, setTieLinkedToWin] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handlePointChange = (stat: string, value: number) => {
    const newStatPoints = {
      ...leagueData.statPoints,
      [stat]: Math.max(value, -999) // Allow negative values, but set a lower limit
    };
    
    updateLeagueData({ statPoints: newStatPoints });
    
    if (stat === 'Tie') {
      setTieLinkedToWin(false);
    }
  };

  const handleStatNameChange = (index: number, newName: string) => {
    const newStats = [...leagueData.stats];
    const oldName = newStats[index].name;
    newStats[index] = { ...newStats[index], name: newName };
    
    const { [oldName]: points, ...rest } = leagueData.statPoints;
    updateLeagueData({
      stats: newStats,
      statPoints: { ...rest, [newName]: points }
    });
  };

  const handleStatAbbrChange = (index: number, newAbbr: string) => {
    const newStats = leagueData.stats.map((stat, i) => 
      i === index ? { ...stat, abbr: newAbbr } : stat
    );
    updateLeagueData({ stats: newStats });
  };

  const handleDeleteStat = (index: number) => {
    const statToDelete = leagueData.stats[index].name;
    const newStats = leagueData.stats.filter((_, i) => i !== index);
    const { [statToDelete]: _, ...newStatPoints } = leagueData.statPoints;
    updateLeagueData({
      stats: newStats,
      statPoints: newStatPoints
    });
  };

  const handleAddStat = () => {
    const newStatName = `New Stat ${leagueData.stats.length + 1}`;
    updateLeagueData({
      stats: [...leagueData.stats, { name: newStatName, abbr: 'NS', isEditing: true }],
      statPoints: { ...leagueData.statPoints, [newStatName]: 0 }
    });
    setIsEditing(true);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    const newStats = leagueData.stats.map(stat => ({ ...stat, isEditing: !isEditing }));
    updateLeagueData({ stats: newStats });
  };

  const toggleStatEditing = (index: number) => {
    const newStats = leagueData.stats.map((stat, i) => 
      i === index ? { ...stat, isEditing: !stat.isEditing } : stat
    );
    updateLeagueData({ stats: newStats });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">Leaderboard Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end">
          <Button
            onClick={toggleEditing}
            className="bg-white text-[#FF7A00] border border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
          >
            {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
            {isEditing ? 'Save Changes' : 'Manual Edit'}
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4 text-sm font-semibold text-gray-600">
          <div className="text-center">Statistic</div>
          <div className="text-center">Abbreviation</div>
          <div className="text-center">Points</div>
          <div className="text-center">Actions</div>
        </div>
        
        {leagueData.stats.map((stat, index) => (
          <div
            key={stat.name}
            className={`grid grid-cols-4 gap-4 py-2 ${index !== leagueData.stats.length - 1 ? 'border-b' : ''}`}
          >
            <div className="font-semibold text-center">
              {stat.isEditing ? (
                <Input
                  value={stat.name}
                  onChange={(e) => handleStatNameChange(index, e.target.value)}
                  className="w-full text-center"
                />
              ) : (
                stat.name
              )}
            </div>
            <div className="text-center">
              {stat.isEditing ? (
                <Input
                  value={stat.abbr}
                  onChange={(e) => handleStatAbbrChange(index, e.target.value)}
                  className="w-full text-center"
                />
              ) : (
                stat.abbr
              )}
            </div>
            <div className="font-semibold text-center">
              {stat.isEditing ? (
                <Input
                  type="number"
                  value={stat.name === 'Tie' && tieLinkedToWin ? (leagueData.statPoints['Win'] / 2).toFixed(1) : leagueData.statPoints[stat.name]}
                  onChange={(e) => handlePointChange(stat.name, parseFloat(e.target.value))}
                  className="w-16 mx-auto text-center"
                />
              ) : (
                stat.name === 'Tie' && tieLinkedToWin ? (leagueData.statPoints['Win'] / 2).toFixed(1) : leagueData.statPoints[stat.name]
              )}
            </div>
            <div className="flex items-center justify-center space-x-2">
              {stat.isEditing ? (
                <>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteStat(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleStatEditing(index)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePointChange(stat.name, leagueData.statPoints[stat.name] - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePointChange(stat.name, leagueData.statPoints[stat.name] + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleStatEditing(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-4">
          <Button
            onClick={handleAddStat}
            className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Statistic
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
