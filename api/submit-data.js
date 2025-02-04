const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    'https://umjrzubqifbmzhwaitag.supabase.co',
    process.env.SUPABASE_KEY
)

module.exports = async (req, res) => {
    const userName = req.query.userName
    const answers = JSON.parse(req.query.answers || '[]')
    
    if (!userName || !answers) {
        return res.status(400).send('Missing parameters')
    }

    try {
        const { data, error } = await supabase
            .from('responses')
            .insert([{ userName, answers }])

        if (error) throw error
        return res.status(200).send('Data saved successfully')
    } catch (error) {
        return res.status(500).send(error.message)
    }
}