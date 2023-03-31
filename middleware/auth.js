const Joi = require('joi')

exports.validation = (req, res, next) => {
    const schema = Joi.object().keys({
        title: Joi.string().required()
    }).unknown(false)

    const { error } = schema.validate(req.body)
    if (error) {
        const { details } = error
        return res.status(400).json({ Status: 400, error: details[0].message })
    } else {
        next()
    }
}