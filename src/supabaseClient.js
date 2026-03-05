import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jcafcewtrpfuxtqpuddb.supabase.co'
const supabaseKey = 'sb_publishable_CdMd_X9IiKa5YTMSP2TS2g_pYMpE8S-'

export const supabase = createClient(supabaseUrl, supabaseKey)