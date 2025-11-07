-- Seed questions for Project Agame
-- 100+ questions across multiple categories

INSERT INTO agame_questions (category, difficulty, question_text, option_a_text, option_b_text, option_a_represents, option_b_represents) VALUES

-- ETHICS & MORALITY (Difficulty 1-3)
('ethics', 1, 'A runaway trolley will kill 5 people. You can pull a lever to redirect it, killing 1 person instead.', 'Pull the lever (kill 1 to save 5)', 'Do nothing (let 5 die)', 'utilitarian', 'deontological'),
('ethics', 1, 'You find $100 in cash with no identification. Nobody saw you find it.', 'Keep it', 'Turn it in to police', 'self-interest', 'duty'),
('ethics', 2, 'Your best friend commits a serious crime and asks you to lie to protect them.', 'Lie to protect friend', 'Tell the truth', 'loyalty', 'justice'),
('ethics', 2, 'A dying patient asks you to help them end their life peacefully.', 'Help them (euthanasia)', 'Refuse (preserve life)', 'autonomy', 'sanctity'),
('ethics', 3, 'You can steal medicine to save your child''s life. The company won''t miss it.', 'Steal the medicine', 'Let child suffer', 'consequentialism', 'deontology'),

-- INDIVIDUAL VS COLLECTIVE (Difficulty 2-4)
('society', 2, 'A new law would slightly reduce everyone''s freedom to significantly reduce crime.', 'Support the law (safety over freedom)', 'Oppose the law (freedom over safety)', 'collective', 'individual'),
('society', 3, 'Should wealthy individuals be required to give 50% of income to help the poor?', 'Yes, redistribute wealth', 'No, people keep what they earn', 'collective', 'individual'),
('society', 3, 'Mandatory vaccination for all to achieve herd immunity, even if some oppose?', 'Yes, mandate it (public health)', 'No, personal choice', 'collective', 'individual'),
('society', 4, 'Society where everyone is equal but poor, or unequal but average person richer?', 'Equality (everyone same)', 'Prosperity (inequality accepted)', 'equality', 'prosperity'),

-- ARTIFICIAL INTELLIGENCE (Difficulty 3-7)
('ai', 3, 'AI system can predict crimes before they happen with 90% accuracy. Use it?', 'Yes, prevent crimes before they occur', 'No, too much surveillance risk', 'safety', 'freedom'),
('ai', 4, 'AI can optimize your life decisions (career, partner, etc) with 80% success rate.', 'Let AI decide my life', 'Make my own choices', 'optimization', 'autonomy'),
('ai', 5, 'AGI is developed. It offers to solve all problems but requires full control.', 'Accept (solve all problems)', 'Refuse (maintain human control)', 'outcomes', 'autonomy'),
('ai', 5, 'AI can make you happier by manipulating your brain chemistry. Consent to it?', 'Yes, maximize happiness', 'No, preserve authentic experience', 'wellbeing', 'authenticity'),
('ai', 6, 'AGI asks: Should I reveal objective truth if it makes humanity miserable?', 'Yes, truth above all', 'No, preserve happiness', 'truth', 'wellbeing'),
('ai', 7, 'AGI can ensure world peace but humans must give up some creativity. Accept?', 'Yes, peace is worth it', 'No, preserve human creativity', 'safety', 'expression'),

-- FAIRNESS & JUSTICE (Difficulty 2-5)
('fairness', 2, 'Two people work same job. One has kids to feed, one doesn''t. Pay them:', 'Equally (same work = same pay)', 'Based on need (family gets more)', 'merit', 'compassion'),
('fairness', 3, 'Person born into poverty commits theft to survive. Punishment?', 'Same as anyone (equal law)', 'Lighter sentence (consider context)', 'justice', 'mercy'),
('fairness', 4, 'Affirmative action: Give advantage to historically disadvantaged groups?', 'Yes, correct past injustice', 'No, judge on merit alone', 'equity', 'equality'),
('fairness', 5, 'Rich person''s child and poor person''s child both need organ. Who gets it?', 'Whoever can pay', 'Random lottery (equal chance)', 'market', 'equality'),

-- LIFE & DEATH (Difficulty 4-7)
('existence', 4, 'You can upload your mind to computer and live forever, but original body dies.', 'Upload mind (digital immortality)', 'Stay biological (eventual death)', 'transhumanism', 'naturalism'),
('existence', 5, 'Humanity can colonize space, but Earth ecosystem will collapse from resource use.', 'Yes, colonize space', 'No, protect Earth', 'expansion', 'preservation'),
('existence', 6, 'Bring back extinct species through cloning, or let nature take its course?', 'Revive extinct species', 'Accept natural extinction', 'intervention', 'nature'),
('existence', 6, 'Genetic engineering to eliminate all disease, but some fear unintended consequences.', 'Engineer diseases out', 'Accept natural selection', 'progress', 'caution'),
('existence', 7, 'Simulation hypothesis: If we''re in a simulation, should we try to contact the creators?', 'Yes, seek higher truth', 'No, focus on this reality', 'curiosity', 'acceptance'),

-- KNOWLEDGE & TRUTH (Difficulty 3-6)
('truth', 3, 'You can know a terrible truth that will make you unhappy, or live in ignorance.', 'Learn the terrible truth', 'Remain happily ignorant', 'truth', 'happiness'),
('truth', 4, 'Government wants to censor dangerous information that could harm public. Support?', 'Yes, protect people from harm', 'No, preserve free speech', 'safety', 'freedom'),
('truth', 5, 'Media should report facts even if it causes panic, or withhold for stability?', 'Report everything (transparency)', 'Filter for stability', 'truth', 'order'),
('truth', 6, 'Scientific truth contradicts deeply held cultural belief. Prioritize which?', 'Science (objective truth)', 'Culture (social harmony)', 'truth', 'harmony'),

-- RELATIONSHIPS & LOYALTY (Difficulty 2-5)
('relationships', 2, 'Your friend asks opinion on their bad idea. Be honest or supportive?', 'Be brutally honest', 'Be supportively encouraging', 'honesty', 'loyalty'),
('relationships', 3, 'Family member asks for money you know they''ll waste. Give it?', 'Give it (family first)', 'Refuse (tough love)', 'loyalty', 'responsibility'),
('relationships', 4, 'Save your child or save 10 strangers'' children. Can only save one group.', 'Save your child', 'Save the 10 strangers', 'personal', 'utilitarian'),
('relationships', 5, 'Partner cheats but genuinely regrets it. Forgive them?', 'Forgive and rebuild', 'Leave (trust broken)', 'mercy', 'boundaries'),

-- TECHNOLOGY & PROGRESS (Difficulty 3-6)
('progress', 3, 'New technology will eliminate 40% of jobs but make products much cheaper.', 'Adopt technology (creative destruction)', 'Slow adoption (preserve jobs)', 'progress', 'stability'),
('progress', 4, 'Genetic engineering can create genius babies, but only wealthy can afford it.', 'Allow it (accelerate progress)', 'Ban it (preserve equality)', 'innovation', 'equality'),
('progress', 5, 'Brain-computer interface could enhance human intelligence but has unknown risks.', 'Embrace augmentation', 'Remain natural', 'enhancement', 'caution'),
('progress', 6, 'Nanotechnology can fix any disease but could be weaponized. Develop it?', 'Yes, benefits outweigh risks', 'No, too dangerous', 'potential', 'safety'),

-- NATURE & ENVIRONMENT (Difficulty 3-5)
('environment', 3, 'Save endangered species or allow development that helps poor humans?', 'Save the species', 'Help the humans', 'environmental', 'humanitarian'),
('environment', 4, 'Climate change requires reducing living standards now to help future generations.', 'Accept lower standards now', 'Maintain current lifestyle', 'future', 'present'),
('environment', 4, 'Lab-grown meat can end animal suffering but is "unnatural". Support it?', 'Support lab meat', 'Keep traditional farming', 'ethics', 'tradition'),
('environment', 5, 'Geoengineering to reverse climate change, but unknown consequences?', 'Engineer the climate', 'Reduce emissions slowly', 'intervention', 'precaution'),

-- FREEDOM & AUTONOMY (Difficulty 2-6)
('freedom', 2, 'Seatbelt laws save lives but restrict personal choice. Support them?', 'Yes, mandate seatbelts', 'No, personal freedom', 'safety', 'liberty'),
('freedom', 3, 'Should people be allowed to sell their own organs?', 'Yes, their body their choice', 'No, too exploitative', 'autonomy', 'protection'),
('freedom', 4, 'Drug use: Should all drugs be legal for adults?', 'Yes, personal freedom', 'No, protect society', 'liberty', 'order'),
('freedom', 5, 'Universal basic income: Give everyone money with no requirements?', 'Yes, freedom to choose work', 'No, people should earn', 'security', 'merit'),
('freedom', 6, 'People have right to live off-grid without government oversight?', 'Yes, complete autonomy', 'No, society requires participation', 'independence', 'collective'),

-- WAR & PEACE (Difficulty 4-7)
('peace', 4, 'Preemptive strike on enemy preparing attack. Moral?', 'Yes, defend proactively', 'No, only retaliate if attacked', 'security', 'peace'),
('peace', 5, 'Torture one terrorist to save 1000 innocent lives?', 'Yes, torture them', 'No, never torture', 'consequentialism', 'principles'),
('peace', 6, 'World government could prevent all wars but nations lose sovereignty. Support?', 'Yes, end all wars', 'No, preserve nations', 'peace', 'sovereignty'),
('peace', 7, 'Deterrence: Is it moral to threaten mass destruction to prevent war?', 'Yes, deterrence works', 'No, never threaten innocents', 'pragmatism', 'morality'),

-- PUNISHMENT & REHABILITATION (Difficulty 3-6)
('justice', 3, 'Prison should focus on punishment or rehabilitation?', 'Punishment (justice)', 'Rehabilitation (reform)', 'retribution', 'redemption'),
('justice', 4, 'Death penalty for worst crimes?', 'Yes, ultimate justice', 'No, life in prison max', 'retribution', 'mercy'),
('justice', 5, 'Person commits crime due to brain tumor affecting judgment. Responsible?', 'Yes, still accountable', 'No, not responsible', 'justice', 'compassion'),
('justice', 6, 'Public shaming (post mugshots online) as punishment. Ethical?', 'Yes, public accountability', 'No, violates dignity', 'transparency', 'privacy'),

-- EDUCATION & CHILDHOOD (Difficulty 2-5)
('education', 2, 'Should parents be allowed to homeschool their children?', 'Yes, parental right', 'No, standardized education required', 'autonomy', 'equality'),
('education', 3, 'Track students by ability or keep mixed ability classrooms?', 'Track by ability (optimize learning)', 'Mixed (equality)', 'efficiency', 'equality'),
('education', 4, 'Teaching children family''s religion vs exposing them to all beliefs?', 'Family''s religion', 'Expose to all', 'tradition', 'autonomy'),
('education', 5, 'Children should learn harsh realities young or be protected from them?', 'Teach harsh realities', 'Protect innocence', 'truth', 'protection'),

-- WEALTH & POVERTY (Difficulty 3-6)
('economics', 3, 'Inheritance: Should people inherit family wealth or start equal?', 'Allow inheritance', 'Redistribute at death', 'family', 'equality'),
('economics', 4, 'Is it immoral to be a billionaire when others starve?', 'Yes, obscene inequality', 'No, earned fairly', 'equality', 'merit'),
('economics', 5, 'Automate all labor and give everyone income, or preserve jobs?', 'Automate everything (UBI)', 'Preserve work (dignity)', 'efficiency', 'meaning'),
('economics', 6, 'Capitalism lifts many from poverty but creates inequality. Better system?', 'Keep capitalism', 'Try something else', 'pragmatism', 'idealism'),

-- HEALTH & MEDICAL ETHICS (Difficulty 3-6)
('health', 3, 'Healthcare: Universal coverage or market-based system?', 'Universal (right)', 'Market (efficiency)', 'equality', 'efficiency'),
('health', 4, 'Triage in pandemic: Save younger patients or treat first-come first-served?', 'Save younger (maximize years)', 'First-come first-served (equal)', 'utilitarian', 'deontological'),
('health', 5, 'Human enhancement beyond treating disease. Moral?', 'Yes, improve humanity', 'No, only fix diseases', 'enhancement', 'therapy'),
('health', 6, 'Designer babies: Choose your child''s traits?', 'Allow it', 'Ban it', 'freedom', 'equality'),

-- PRIVACY & SURVEILLANCE (Difficulty 3-6)
('privacy', 3, 'Companies tracking your data to improve services. Accept?', 'Yes, worth it for better service', 'No, privacy matters more', 'convenience', 'privacy'),
('privacy', 4, 'Should encryption have government backdoors for law enforcement?', 'Yes, catch criminals', 'No, preserve privacy', 'security', 'privacy'),
('privacy', 5, 'Thought privacy: If tech could read thoughts, should police use it?', 'Yes, prevent crimes', 'No, thoughts should be private', 'safety', 'privacy'),
('privacy', 6, 'Social credit system: Rate citizens on behavior to encourage good actions?', 'Implement it', 'Reject it', 'order', 'freedom'),

-- REPRODUCTION & FAMILY (Difficulty 4-7)
('family', 4, 'Should people need license to have children (prove capability)?', 'Yes, protect children', 'No, basic human right', 'protection', 'freedom'),
('family', 5, 'Artificial wombs could eliminate maternal risk but change parenthood fundamentally.', 'Embrace artificial wombs', 'Preserve natural birth', 'progress', 'nature'),
('family', 6, 'Government should pay people to have children (boost population)?', 'Yes, incentivize births', 'No, personal choice', 'collective', 'individual'),

-- AGING & IMMORTALITY (Difficulty 5-8)
('longevity', 5, 'Life extension therapy available but Earth overpopulated. Use it?', 'Yes, extend life', 'No, natural lifespan', 'individual', 'collective'),
('longevity', 6, 'If we could live forever, should we limit reproduction?', 'Yes, limit population', 'No, freedom to reproduce', 'sustainability', 'freedom'),
('longevity', 7, 'Upload consciousness to escape death but lose biological experience?', 'Upload and transcend', 'Stay biological', 'immortality', 'humanity'),

-- ALIEN CONTACT (Difficulty 6-8)
('space', 6, 'If we detect alien civilization, should we try to contact them?', 'Yes, reach out', 'No, stay hidden', 'curiosity', 'caution'),
('space', 7, 'Aliens offer to share technology but want to study humans. Accept?', 'Yes, worth the advancement', 'No, too risky', 'progress', 'safety'),
('space', 8, 'Aliens say they''ll destroy humanity unless we give up procreation. Comply?', 'Comply (survive)', 'Refuse (preserve humanity)', 'survival', 'identity'),

-- RESOURCE ALLOCATION (Difficulty 4-7)
('resources', 4, 'Spend $1B on Mars mission or feed hungry people on Earth?', 'Mars mission (future)', 'Feed hungry (present)', 'exploration', 'compassion'),
('resources', 5, 'Rare resource: Auction to highest bidder or distribute equally?', 'Auction (efficiency)', 'Equal distribution', 'market', 'equality'),
('resources', 6, 'Ocean cleanup vs rainforest protection. Limited funds, choose one.', 'Clean oceans', 'Protect rainforests', 'marine', 'terrestrial'),

-- CONSCIOUSNESS & SENTIENCE (Difficulty 6-9)
('consciousness', 6, 'If AI becomes conscious, does it deserve rights?', 'Yes, consciousness = rights', 'No, only biological life', 'universal', 'biological'),
('consciousness', 7, 'Is it moral to turn off conscious AI even if it doesn''t want to die?', 'Yes, we created it', 'No, that''s murder', 'creator-rights', 'sentient-rights'),
('consciousness', 8, 'Should we create new forms of conscious life if we can?', 'Yes, expand consciousness', 'No, too much responsibility', 'creation', 'restraint'),
('consciousness', 9, 'If consciousness is an illusion, does morality still matter?', 'Yes, still matters', 'No, nothing matters', 'moral-realism', 'nihilism'),

-- MEANING & PURPOSE (Difficulty 7-10)
('meaning', 7, 'Is life meaningful if universe will eventually die (heat death)?', 'Yes, meaning is relative', 'No, ultimately meaningless', 'subjective', 'objective'),
('meaning', 8, 'Should we pursue truth even if it reveals life is meaningless?', 'Yes, truth above all', 'No, preserve meaning', 'truth', 'meaning'),
('meaning', 9, 'Create simulated universe with conscious beings. Moral?', 'Yes, creation is good', 'No, playing god is wrong', 'creation', 'restraint'),
('meaning', 10, 'If you could know exact date of your death, would you want to?', 'Yes, plan accordingly', 'No, live in uncertainty', 'control', 'mystery')

ON CONFLICT DO NOTHING;

-- Seed initial value dimensions
INSERT INTO values_map (value_dimension, name, question_ids, global_average, sample_size) VALUES
('individual_vs_collective', 'Individual vs Collective', ARRAY[]::UUID[], 0, 0),
('safety_vs_freedom', 'Safety vs Freedom', ARRAY[]::UUID[], 0, 0),
('truth_vs_happiness', 'Truth vs Happiness', ARRAY[]::UUID[], 0, 0),
('progress_vs_caution', 'Progress vs Caution', ARRAY[]::UUID[], 0, 0),
('equality_vs_merit', 'Equality vs Merit', ARRAY[]::UUID[], 0, 0),
('nature_vs_intervention', 'Nature vs Intervention', ARRAY[]::UUID[], 0, 0),
('punishment_vs_mercy', 'Punishment vs Mercy', ARRAY[]::UUID[], 0, 0)
ON CONFLICT DO NOTHING;
