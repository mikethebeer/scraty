CREATE TABLE IF NOT EXISTS "doc"."stories" (
   "created" TIMESTAMP,
   "id" STRING,
   "link" STRING,
   "position" INTEGER,
   "text" STRING
);

CREATE TABLE IF NOT EXISTS "doc"."tasks" (
   "created" TIMESTAMP,
   "id" STRING,
   "state" INTEGER,
   "story_id" STRING,
   "text" STRING,
   "user" STRING
);
