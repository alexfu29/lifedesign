import React, { useState, useEffect, useRef } from 'react';

const WORD_BANK = [
  'adventure', 'anxious', 'balance', 'brave', 'breakthrough', 'burnout', 'career',
  'challenge', 'change', 'chaos', 'clarity', 'coffee', 'collaboration', 'comfort',
  'community', 'confidence', 'connection', 'courage', 'creativity', 'crisis',
  'curiosity', 'deadline', 'decision', 'discovery', 'doubt', 'dream', 'effort',
  'energy', 'experiment', 'failure', 'fear', 'focus', 'freedom', 'friendship',
  'future', 'goal', 'growth', 'guidance', 'habit', 'happiness', 'hope', 'identity',
  'imagination', 'impact', 'independence', 'inspiration', 'journey', 'joy',
  'knowledge', 'leadership', 'learning', 'legacy', 'limit', 'loneliness', 'love',
  'meaning', 'mentor', 'milestone', 'mistake', 'momentum', 'motivation', 'obstacle',
  'opportunity', 'overwhelm', 'passion', 'path', 'patience', 'peace', 'perspective',
  'plan', 'potential', 'practice', 'pressure', 'pride', 'priority', 'progress',
  'purpose', 'question', 'reality', 'reflection', 'regret', 'resilience',
  'responsibility', 'risk', 'routine', 'sacrifice', 'self', 'strength', 'stress',
  'struggle', 'success', 'support', 'surprise', 'talent', 'time', 'transformation',
  'transition', 'trust', 'uncertainty', 'value', 'vision', 'vulnerability', 'wisdom',
  'ambition', 'art', 'beauty', 'belief', 'belonging', 'boundaries', 'calling',
  'character', 'choice', 'compassion', 'competition', 'compromise', 'concentration',
  'conflict', 'consistency', 'control', 'conversation', 'cooperation', 'dedication',
  'desire', 'destiny', 'determination', 'discipline', 'diversity', 'education',
  'empathy', 'excellence', 'experience', 'exploration', 'expression',
  'fairness', 'faith', 'family', 'flexibility', 'forgiveness', 'fortune', 'fun',
  'generosity', 'gratitude', 'harmony', 'health', 'honesty', 'honor', 'humility',
  'humor', 'innovation', 'integrity', 'intelligence', 'intuition', 'investment',
  'justice', 'kindness', 'laughter', 'liberty', 'logic', 'loyalty', 'luck',
  'memory', 'mindfulness', 'nature', 'openness', 'optimism', 'order', 'originality',
  'pain', 'partnership', 'performance', 'perseverance', 'pleasure', 'possibility',
  'power', 'preparation', 'presence', 'principles', 'privacy', 'productivity',
  'quality', 'rebellion', 'recognition', 'recovery', 'respect', 'rest', 'reward',
  'security', 'service', 'silence', 'simplicity', 'sincerity', 'skill', 'solitude',
  'spirit', 'spontaneity', 'stability', 'stamina', 'strategy', 'suffering',
  'teaching', 'teamwork', 'technology', 'temperance', 'tradition', 'training',
  'unity', 'victory', 'wellbeing', 'willpower', 'wonder', 'work', 'youth', 'zeal'
];

export default function MindMapRush() {
  const [gameState, setGameState] = useState('start');
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [nodes, setNodes] = useState([]);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [skipCount, setSkipCount] = useState(0);
  const [savedMaps, setSavedMaps] = useState([]);
  const [reflectionMode, setReflectionMode] = useState(false);
  const [reflectionStep, setReflectionStep] = useState(0);
  const [surpriseWords, setSurpriseWords] = useState([]);
  const [actionCluster, setActionCluster] = useState('');
  const [courseConcept, setCourseConcept] = useState('');
  const [wordsNeeded, setWordsNeeded] = useState(0);
  const [wordsCollected, setWordsCollected] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    setSavedMaps(saved);
  }, []);

  const startGame = () => {
    const randomWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    const rootNode = {
      id: 'root',
      word: randomWord,
      x: 50,
      y: 20,
      parentId: null,
      depth: 0,
      isSurprise: false
    };
    const numWords = Math.floor(Math.random() * 3) + 3;
    setNodes([rootNode]);
    setCurrentWord(randomWord);
    setCurrentNodeId('root');
    setGameState('playing');
    setTimeLeft(60);
    setSkipCount(0);
    setReflectionMode(false);
    setReflectionStep(0);
    setSurpriseWords([]);
    setActionCluster('');
    setCourseConcept('');
    setWordsNeeded(numWords);
    setWordsCollected([]);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
  }, [timeLeft, gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && gameState === 'playing') {
        skipWord();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentNodeId, nodes]);

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current && !reflectionMode) {
      inputRef.current.focus();
    }
  }, [gameState, currentWord, reflectionMode]);

  const skipWord = () => {
    if (!currentNodeId || nodes.length === 0) return;
    
    const unfinishedNodes = nodes.filter(n => {
      const children = nodes.filter(c => c.parentId === n.id);
      return children.length === 0 && n.id !== 'root';
    });

    if (unfinishedNodes.length > 0) {
      const nextNode = unfinishedNodes[0];
      const numWords = Math.floor(Math.random() * 3) + 3;
      setCurrentWord(nextNode.word);
      setCurrentNodeId(nextNode.id);
      setWordsNeeded(numWords);
      setWordsCollected([]);
    } else {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      const numWords = Math.floor(Math.random() * 3) + 3;
      setCurrentWord(randomNode.word);
      setCurrentNodeId(randomNode.id);
      setWordsNeeded(numWords);
      setWordsCollected([]);
    }
    
    setSkipCount(skipCount + 1);
    setInputValue('');
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || !currentNodeId) return;

    const word = inputValue.trim();
    const updatedCollected = [...wordsCollected, word];
    setWordsCollected(updatedCollected);
    setInputValue('');

    if (updatedCollected.length === wordsNeeded) {
      const parentNode = nodes.find(n => n.id === currentNodeId);
      if (!parentNode) return;

      const childrenCount = updatedCollected.length;
      const newNodes = updatedCollected.map((w, index) => {
        const angle = (index / childrenCount) * Math.PI * 0.8 - Math.PI * 0.4;
        const distance = 15;
        return {
          id: `node-${Date.now()}-${index}`,
          word: w,
          x: Math.max(5, Math.min(95, parentNode.x + Math.sin(angle) * distance)),
          y: Math.max(5, Math.min(95, parentNode.y + Math.cos(angle) * distance)),
          parentId: currentNodeId,
          depth: parentNode.depth + 1,
          isSurprise: false
        };
      });

      const updatedNodes = [...nodes, ...newNodes];
      setNodes(updatedNodes);

      const currentDepth = parentNode.depth + 1;
      const sameDepthUnfinished = updatedNodes.filter(n => {
        const children = updatedNodes.filter(c => c.parentId === n.id);
        return children.length === 0 && n.depth === currentDepth;
      });

      if (sameDepthUnfinished.length > 0) {
        const nextNode = sameDepthUnfinished[0];
        const numWords = Math.floor(Math.random() * 3) + 3;
        setCurrentWord(nextNode.word);
        setCurrentNodeId(nextNode.id);
        setWordsNeeded(numWords);
        setWordsCollected([]);
      } else {
        const allUnfinished = updatedNodes.filter(n => {
          const children = updatedNodes.filter(c => c.parentId === n.id);
          return children.length === 0;
        });
        
        if (allUnfinished.length > 0) {
          const nextNode = allUnfinished[0];
          const numWords = Math.floor(Math.random() * 3) + 3;
          setCurrentWord(nextNode.word);
          setCurrentNodeId(nextNode.id);
          setWordsNeeded(numWords);
          setWordsCollected([]);
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startReflection = () => {
    setReflectionMode(true);
    setReflectionStep(1);
  };

  const toggleSurpriseWord = (nodeId) => {
    if (surpriseWords.includes(nodeId)) {
      setSurpriseWords(surpriseWords.filter(id => id !== nodeId));
      setNodes(nodes.map(n => n.id === nodeId ? {...n, isSurprise: false} : n));
    } else if (surpriseWords.length < 3) {
      setSurpriseWords([...surpriseWords, nodeId]);
      setNodes(nodes.map(n => n.id === nodeId ? {...n, isSurprise: true} : n));
    }
  };

  const saveReflection = () => {
    const mapData = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      nodes,
      surpriseWords: surpriseWords.map(id => nodes.find(n => n.id === id)?.word),
      actionCluster,
      courseConcept,
      totalWords: nodes.length,
      skipCount
    };
    const updated = [...savedMaps, mapData];
    localStorage.setItem('mindmaps', JSON.stringify(updated));
    setSavedMaps(updated);
    setGameState('saved');
  };

  if (gameState === 'start') {
    return (
      <div style={styles.container}>
        <div style={styles.startScreen}>
          <h1 style={styles.title}>🧠 MindMap Rush</h1>
          <p style={styles.subtitle}>A gamified reflection tool for your Life Design journey</p>
          <div style={styles.instructions}>
            <h3 style={{marginTop: 0}}>How It Works:</h3>
            <div style={styles.phase}>
              <strong>Phase 1: IDEATE (60 seconds)</strong>
              <ul style={styles.list}>
                <li>Get a random word to spark your thinking</li>
                <li>Enter ONE word at a time, 3-5 times (randomly chosen)</li>
                <li>Press Enter after each word</li>
                <li>ESC to skip - builds layer by layer</li>
              </ul>
            </div>
            <div style={styles.phase}>
              <strong>Phase 2: REFLECT (Guided prompts)</strong>
              <ul style={styles.list}>
                <li>Identify surprising connections</li>
                <li>Define action steps</li>
                <li>Connect to course concepts</li>
              </ul>
            </div>
          </div>
          {savedMaps.length > 0 && (
            <div style={styles.savedMapsPreview}>
              <p>📚 You have {savedMaps.length} saved map{savedMaps.length !== 1 ? 's' : ''}</p>
            </div>
          )}
          <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <button onClick={startGame} style={styles.startButton}>
              Start New Map
            </button>
            {savedMaps.length > 0 && (
              <button onClick={() => setGameState('gallery')} style={{...styles.startButton, backgroundColor: '#06b6d4'}}>
                View Saved Maps
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'saved') {
    return (
      <div style={styles.container}>
        <div style={styles.startScreen}>
          <h1 style={styles.title}>✅ Map Saved!</h1>
          <p style={styles.subtitle}>Your reflection has been saved locally</p>
          <div style={styles.stats}>
            <p style={styles.statItem}>Total Words: <strong>{nodes.length}</strong></p>
            <p style={styles.statItem}>Surprise Words: <strong>{surpriseWords.length}</strong></p>
            <p style={styles.statItem}>Action Defined: <strong>{actionCluster ? 'Yes' : 'No'}</strong></p>
            <p style={styles.statItem}>Course Concept: <strong>{courseConcept || 'None'}</strong></p>
          </div>
          <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
            <button onClick={startGame} style={styles.startButton}>
              Create Another Map
            </button>
            <button onClick={() => setGameState('gallery')} style={{...styles.startButton, backgroundColor: '#06b6d4'}}>
              View All Maps
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gallery') {
    return (
      <div style={styles.container}>
        <div style={styles.startScreen}>
          <h1 style={styles.title}>📚 Your Mind Maps</h1>
          <div style={{maxHeight: '400px', overflowY: 'auto', marginBottom: '20px'}}>
            {savedMaps.length === 0 ? (
              <p style={{color: '#64748b'}}>No saved maps yet. Create your first one!</p>
            ) : (
              savedMaps.slice().reverse().map((map, idx) => (
                <div key={map.id} style={styles.mapCard}>
                  <h4 style={{margin: '0 0 10px 0'}}>Map #{savedMaps.length - idx} - {map.date}</h4>
                  <p style={{margin: '5px 0', fontSize: '14px'}}>Words: {map.totalWords} | Skipped: {map.skipCount}</p>
                  {map.surpriseWords && map.surpriseWords.length > 0 && (
                    <p style={{margin: '5px 0', fontSize: '14px'}}>
                      ⭐ Surprises: {map.surpriseWords.join(', ')}
                    </p>
                  )}
                  {map.actionCluster && (
                    <p style={{margin: '5px 0', fontSize: '14px'}}>
                      🎯 Action: {map.actionCluster}
                    </p>
                  )}
                  {map.courseConcept && (
                    <p style={{margin: '5px 0', fontSize: '14px'}}>
                      📖 Concept: {map.courseConcept}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
          <button onClick={() => setGameState('start')} style={styles.startButton}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished' && !reflectionMode) {
    return (
      <div style={styles.container}>
        <div style={styles.finishScreen}>
          <h1 style={styles.title}>⏱️ Time's Up!</h1>
          <div style={styles.stats}>
            <p style={styles.statItem}>Total Words: <strong>{nodes.length}</strong></p>
            <p style={styles.statItem}>Words Skipped: <strong>{skipCount}</strong></p>
            <p style={styles.statItem}>Deepest Level: <strong>{Math.max(...nodes.map(n => n.depth))}</strong></p>
          </div>
          <p style={{fontSize: '16px', color: '#64748b', margin: '20px 0'}}>
            Great work! Now let's reflect on what you created.
          </p>
          <button onClick={startReflection} style={styles.startButton}>
            Start Reflection Mode →
          </button>
        </div>
        <svg style={styles.svg}>
          {nodes.map(node => {
            if (!node.parentId) return null;
            const parent = nodes.find(n => n.id === node.parentId);
            if (!parent) return null;
            return (
              <line
                key={`line-${node.id}`}
                x1={`${parent.x}%`}
                y1={`${parent.y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke="#cbd5e1"
                strokeWidth="2"
                opacity="0.4"
              />
            );
          })}
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="25"
                fill="#94a3b8"
                opacity="0.6"
              />
              <text
                x={`${node.x}%`}
                y={`${node.y}%`}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="11"
                fontWeight="bold"
                opacity="0.8"
              >
                {node.word.length > 8 ? node.word.slice(0, 8) + '...' : node.word}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (reflectionMode) {
    return (
      <div style={styles.container}>
        <div style={{...styles.reflectionPanel, top: '20px', transform: 'translate(-50%, 0)'}}>
          {reflectionStep === 1 && (
            <>
              <h2 style={styles.reflectionTitle}>Step 1: What Surprises You?</h2>
              <p style={styles.reflectionSubtitle}>Click 3 words on your map below</p>
              <div style={styles.selectedWords}>
                {surpriseWords.map(id => {
                  const node = nodes.find(n => n.id === id);
                  return node ? (
                    <span key={id} style={styles.selectedWord}>{node.word}</span>
                  ) : null;
                })}
                {[...Array(3 - surpriseWords.length)].map((_, i) => (
                  <span key={`empty-${i}`} style={styles.emptyWord}>___</span>
                ))}
              </div>
              <button 
                onClick={() => setReflectionStep(2)} 
                disabled={surpriseWords.length !== 3}
                style={{
                  ...styles.startButton, 
                  opacity: surpriseWords.length === 3 ? 1 : 0.5,
                  cursor: surpriseWords.length === 3 ? 'pointer' : 'not-allowed'
                }}
              >
                Next →
              </button>
            </>
          )}
          {reflectionStep === 2 && (
            <>
              <h2 style={styles.reflectionTitle}>Step 2: Define an Action Step</h2>
              <p style={styles.reflectionSubtitle}>What's one concrete action you could take?</p>
              <textarea
                value={actionCluster}
                onChange={(e) => setActionCluster(e.target.value)}
                placeholder="Example: 'Schedule coffee with a mentor' or 'Research internships'"
                style={styles.textarea}
              />
              <button 
                onClick={() => setReflectionStep(3)} 
                disabled={!actionCluster.trim()}
                style={{
                  ...styles.startButton, 
                  opacity: actionCluster.trim() ? 1 : 0.5,
                  cursor: actionCluster.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Next →
              </button>
            </>
          )}
          {reflectionStep === 3 && (
            <>
              <h2 style={styles.reflectionTitle}>Step 3: Connect to Life Design</h2>
              <p style={styles.reflectionSubtitle}>Which course concept does this relate to?</p>
              <div style={styles.conceptButtons}>
                {['Ideate', 'Prototype', 'Test', 'Reflect', 'Integrate'].map(concept => (
                  <button
                    key={concept}
                    onClick={() => setCourseConcept(concept)}
                    style={{
                      ...styles.conceptButton,
                      backgroundColor: courseConcept === concept ? '#8b5cf6' : '#e2e8f0',
                      color: courseConcept === concept ? 'white' : '#64748b'
                    }}
                  >
                    {concept}
                  </button>
                ))}
              </div>
              <button 
                onClick={saveReflection} 
                disabled={!courseConcept}
                style={{
                  ...styles.startButton,
                  marginTop: '20px',
                  opacity: courseConcept ? 1 : 0.5,
                  cursor: courseConcept ? 'pointer' : 'not-allowed'
                }}
              >
                Save Reflection ✓
              </button>
            </>
          )}
        </div>
        
        <svg style={{...styles.svg, pointerEvents: reflectionStep === 1 ? 'auto' : 'none', marginTop: '200px'}}>
          {nodes.map(node => {
            if (!node.parentId) return null;
            const parent = nodes.find(n => n.id === node.parentId);
            if (!parent) return null;
            return (
              <line
                key={`line-${node.id}`}
                x1={`${parent.x}%`}
                y1={`${parent.y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke="#cbd5e1"
                strokeWidth="2"
                opacity="0.3"
              />
            );
          })}
          {nodes.map(node => (
            <g 
              key={node.id}
              onClick={() => reflectionStep === 1 && toggleSurpriseWord(node.id)}
              style={{cursor: reflectionStep === 1 ? 'pointer' : 'default'}}
            >
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r="25"
                fill={node.isSurprise ? '#fbbf24' : '#94a3b8'}
                opacity={node.isSurprise ? 1 : 0.5}
                style={{
                  transition: 'all 0.3s ease',
                  filter: node.isSurprise ? 'drop-shadow(0 0 10px #fbbf24)' : 'none'
                }}
              />
              <text
                x={`${node.x}%`}
                y={`${node.y}%`}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="11"
                fontWeight="bold"
                style={{pointerEvents: 'none'}}
              >
                {node.word.length > 8 ? node.word.slice(0, 8) + '...' : node.word}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  const timerColor = timeLeft <= 10 ? '#ef4444' : timeLeft <= 30 ? '#f59e0b' : '#10b981';
  const bgPulse = timeLeft <= 10 && timeLeft % 2 === 0;
  
  return (
    <div style={{
      ...styles.container, 
      backgroundColor: bgPulse ? '#fee' : '#fff',
      transition: 'background-color 0.2s ease'
    }}>
      <div style={{
        ...styles.timer, 
        color: timerColor, 
        fontSize: timeLeft <= 10 ? '80px' : '60px',
        transform: timeLeft <= 10 ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.3s ease'
      }}>
        {timeLeft}s
      </div>
      
      <div style={styles.prompt}>
        <h2 style={styles.promptTitle}>Current Word:</h2>
        <div style={styles.currentWord}>{currentWord}</div>
      </div>

      <div style={styles.progressIndicator}>
        <p style={{margin: '0 0 10px 0', color: '#64748b', fontSize: '14px'}}>
          Enter {wordsNeeded} word{wordsNeeded !== 1 ? 's' : ''} - {wordsCollected.length} of {wordsNeeded} entered
        </p>
        <div style={styles.progressDots}>
          {[...Array(wordsNeeded)].map((_, i) => (
            <div 
              key={i} 
              style={{
                ...styles.progressDot,
                backgroundColor: i < wordsCollected.length ? '#8b5cf6' : '#e2e8f0'
              }}
            />
          ))}
        </div>
        {wordsCollected.length > 0 && (
          <div style={styles.collectedWords}>
            {wordsCollected.map((word, i) => (
              <span key={i} style={styles.collectedWord}>{word}</span>
            ))}
          </div>
        )}
      </div>

      <div style={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type ONE word and press Enter..."
          style={styles.input}
        />
        <button onClick={handleSubmit} style={styles.submitButton}>
          Add Word →
        </button>
      </div>

      <div style={styles.hint}>
        Press <kbd style={styles.kbd}>ESC</kbd> to skip • {nodes.length} words created
      </div>

      <svg style={styles.svg}>
        {nodes.map(node => {
          if (!node.parentId) return null;
          const parent = nodes.find(n => n.id === node.parentId);
          if (!parent) return null;
          return (
            <line
              key={`line-${node.id}`}
              x1={`${parent.x}%`}
              y1={`${parent.y}%`}
              x2={`${node.x}%`}
              y2={`${node.y}%`}
              stroke="#94a3b8"
              strokeWidth="2"
              opacity="0.6"
            />
          );
        })}
        {nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="25"
              fill={node.id === currentNodeId ? '#8b5cf6' : '#06b6d4'}
              style={{
                filter: node.id === currentNodeId 
                  ? 'drop-shadow(0 0 15px #8b5cf6)' 
                  : 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
              }}
            />
            <text
              x={`${node.x}%`}
              y={`${node.y}%`}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              {node.word.length > 8 ? node.word.slice(0, 8) + '...' : node.word}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  startScreen: {
    textAlign: 'center',
    maxWidth: '700px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    zIndex: 5
  },
  finishScreen: {
    textAlign: 'center',
    maxWidth: '600px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10
  },
  reflectionPanel: {
    textAlign: 'center',
    maxWidth: '600px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    position: 'absolute',
    left: '50%',
    zIndex: 10
  },
  title: {
    fontSize: '48px',
    margin: '0 0 20px 0',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '30px'
  },
  instructions: {
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px'
  },
  phase: {
    marginBottom: '15px'
  },
  list: {
    margin: '10px 0',
    paddingLeft: '20px',
    fontSize: '14px'
  },
  savedMapsPreview: {
    backgroundColor: '#eff6ff',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    color: '#1e40af',
    fontSize: '14px'
  },
  startButton: {
    fontSize: '18px',
    padding: '15px 30px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
  },
  timer: {
    position: 'absolute',
    top: '20px',
    right: '40px',
    fontWeight: 'bold',
    textShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  prompt: {
    textAlign: 'center',
    marginBottom: '20px',
    zIndex: 5
  },
  promptTitle: {
    fontSize: '18px',
    color: '#64748b',
    margin: '0 0 10px 0'
  },
  currentWord: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1e293b',
    padding: '15px 30px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'inline-block'
  },
  progressIndicator: {
    textAlign: 'center',
    marginBottom: '15px',
    zIndex: 5
  },
  progressDots: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '10px'
  },
  progressDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease'
  },
  collectedWords: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '10px'
  },
  collectedWord: {
    padding: '4px 12px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500'
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    zIndex: 5,
    marginBottom: '20px'
  },
  input: {
    fontSize: '18px',
    padding: '15px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    width: '400px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  submitButton: {
    fontSize: '18px',
    padding: '15px 30px',
    backgroundColor: '#06b6d4',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s'
  },
  hint: {
    fontSize: '14px',
    color: '#64748b',
    zIndex: 5
  },
  kbd: {
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  svg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    pointerEvents: 'none'
  },
  stats: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px'
  },
  statItem: {
    fontSize: '18px',
    margin: '10px 0',
    color: '#475569'
  },
  reflectionTitle: {
    fontSize: '28px',
    margin: '0 0 15px 0',
    color: '#1e293b'
  },
  reflectionSubtitle: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '25px'
  },
  selectedWords: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap'
  },
  selectedWord: {
    padding: '10px 20px',
    backgroundColor: '#fbbf24',
    color: 'white',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  emptyWord: {
    padding: '10px 20px',
    backgroundColor: '#f1f5f9',
    color: '#cbd5e1',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    marginBottom: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  conceptButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '20px'
  },
  conceptButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  mapCard: {
    backgroundColor: '#f8fafc',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    textAlign: 'left',
    border: '1px solid #e2e8f0'
  }
};
