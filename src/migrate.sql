-- xlg_logging: rename from tlg_logging
ALTER TABLE IF EXISTS public.tlg_logging RENAME TO xlg_logging;
ALTER INDEX IF EXISTS tlg_logging_pkey RENAME TO xlg_logging_pkey;

-- tsb_subject: add sb_level column
ALTER TABLE public.tsb_subject
  ADD COLUMN IF NOT EXISTS sb_level character varying(16) DEFAULT '';

-- tdb_database: add missing UNIQUE on db_dbid
ALTER TABLE public.tdb_database
  ADD CONSTRAINT tdb_database_db_dbid_key UNIQUE (db_dbid);

-- ths_history: replace UNIQUE with PRIMARY KEY
ALTER TABLE public.ths_history
  DROP CONSTRAINT ths_history_hs_hsid_key,
  ADD CONSTRAINT ths_history_pkey PRIMARY KEY (hs_hsid);

-- tow_owner: add missing UNIQUE on ow_owid
ALTER TABLE public.tow_owner
  ADD CONSTRAINT tow_owner_ow_owid_key UNIQUE (ow_owid);

-- tss_sessions: replace UNIQUE with PRIMARY KEY
ALTER TABLE public.tss_sessions
  DROP CONSTRAINT tss_sessions_ss_ssid_key,
  ADD CONSTRAINT tss_sessions_pkey PRIMARY KEY (ss_ssid);

-- tuo_usersowner: align uo_owner size with tow_owner.ow_owner (varchar 32 -> 16)
-- safe to run only if no existing values exceed 16 chars
ALTER TABLE public.tuo_usersowner
  ALTER COLUMN uo_owner TYPE character varying(16);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ths_history_hs_usid ON public.ths_history (hs_usid);
CREATE INDEX IF NOT EXISTS idx_ths_history_hs_sbid ON public.ths_history (hs_sbid);
CREATE INDEX IF NOT EXISTS idx_tss_sessions_ss_usid ON public.tss_sessions (ss_usid);
CREATE INDEX IF NOT EXISTS idx_tqq_questions_qq_sbid ON public.tqq_questions (qq_sbid);
CREATE INDEX IF NOT EXISTS idx_trf_reference_rf_sbid ON public.trf_reference (rf_sbid);
