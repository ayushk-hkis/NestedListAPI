const List = require('../models/list')
const { ResCode, messages } = require('../utils/response')

exports.getList = async (req, res) => {
    try {
        const list = await List.findAll()
        const data = JSON.stringify(list)
        const finalData = JSON.parse(data)

        const filter = (f) => {
            const main = []

            for (var i = 0; i < f.length; i++) {
                const obj = {
                    "id": '',
                    "title": '',
                    "child": []
                }
                if (f[i].parent == 0) {
                    obj.id = f[i].id
                    obj.title = f[i].title
                    main.push(obj)
                } else {
                    const addToParent = (parent, child) => {
                        if (parent.id === child.parent) {
                            parent.child.push(child);
                            return true;
                        } else if (parent.child && parent.child.length) {
                            for (let i = 0; i < parent.child.length; i++) {
                                const found = addToParent(parent.child[i], child);
                                if (found) return true;
                            }
                        }
                        return false;
                    };

                    const child = {
                        id: f[i].id,
                        title: f[i].title,
                        parent: f[i].parent,
                        child: []
                    };
                    const addedToParent = addToParent({ child: main }, child);

                    if (!addedToParent) {
                        filter([child])
                            .forEach(c => main.push(c));
                    }
                }
            }
            return main
        }

        return res.status(ResCode.SUCCESS).json({ status: ResCode.SUCCESS, message: messages.LIST_DATA, data: filter(finalData) })
    } catch (error) {
        console.log(error)

        return res.status(ResCode.SERVER_ERROR).json({ status: ResCode.SERVER_ERROR, message: messages.INTERNAL_SERVER_ERROR })
    }
}

exports.addList = async (req, res) => {
    try {
        const id = req.params.id
        const { title } = req.body
        const addElem = {
            title
        }

        if (id) {
            const user = await List.findByPk(id)
            if (!user) {
                return res.status(ResCode.NOT_FOUND).json({ status: ResCode.NOT_FOUND, message: messages.NOT_FOUND })
            }
            addElem.parent = id
        }

        const addList = await List.create(addElem)
        return res.status(ResCode.CREATED).json({ status: ResCode.CREATED, message: messages.ELEMENT_ADDED, data: addList })
    } catch (error) {
        console.log(error)

        return res.status(ResCode.SERVER_ERROR).json({ status: ResCode.SERVER_ERROR, message: messages.INTERNAL_SERVER_ERROR })
    }
}

exports.updateList = async (req, res) => {
    try {
        const id = req.params.id
        const { title } = req.body
        const listItem = await List.findByPk(id)

        if (!listItem) {
            return res.status(ResCode.NOT_FOUND).json({ status: ResCode.NOT_FOUND, message: messages.NOT_FOUND })
        }

        const updateElem = { title }
        await List.update(updateElem, { where: { id } })

        return res.status(ResCode.CREATED).json({ status: ResCode.CREATED, message: messages.ELEMENT_UPDATED, data: await List.findByPk(id) })
    } catch (error) {
        console.log(error)

        return res.status(ResCode.SERVER_ERROR).json({ status: ResCode.SERVER_ERROR, message: messages.INTERNAL_SERVER_ERROR })
    }
}

exports.deleteList = async (req, res) => {
    try {
        const id = req.params.id
        const item = await List.findByPk(id);

        if (!item) {
            return res.status(ResCode.NOT_FOUND).json({ status: ResCode.NOT_FOUND, message: messages.NOT_FOUND });
        }

        const deleteChildItems = async (parentId) => {
            const children = await List.findAll({ where: { parent: parentId } })
            for (const child of children) {
                await deleteChildItems(child.id)
            }
            await List.destroy({ where: { parent: parentId } })
        }
        await deleteChildItems(id)

        await item.destroy()

        return res.status(ResCode.SUCCESS).json({ status: ResCode.SUCCESS, message: messages.ELEMENT_DELETED })
    } catch (error) {
        console.log(error)

        return res.status(ResCode.SERVER_ERROR).json({ status: ResCode.SERVER_ERROR, message: messages.INTERNAL_SERVER_ERROR })
    }
}