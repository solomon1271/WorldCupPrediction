-- Run in Neon SQL Editor if production deploy is blocked by a failed
-- 20260627_group_stage_reveal_seen migration (P3009).
DELETE FROM "_prisma_migrations"
WHERE migration_name = '20260627_group_stage_reveal_seen';

DROP TABLE IF EXISTS "GroupStageRevealSeen";
