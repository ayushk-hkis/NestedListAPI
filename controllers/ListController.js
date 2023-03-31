const List = require('../models/list')

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

        return res.status(200).json({ Status: 200, Message: 'List Data', Data: filter(finalData) })
    } catch (error) {
        console.log(error)

        return res.status(500).json({ Status: 500, Message: 'Something Went Wrong!' })
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
            addElem.parent = id
        }

        const addList = await List.create(addElem)
        return res.status(201).json({ Status: 201, Message: 'List element added Successdfully!', Data: addList })
    } catch (error) {
        console.log(error)

        return res.status(500).json({ Status: 500, Message: 'Something Went Wrong!' })
    }
}

exports.updateList = async (req, res) => {
    try {
        const id = req.params.id
        const { title } = req.body
        const listItem = await List.findByPk(id)

        if (!listItem) {
            return res.status(404).json({ Status: 404, Message: 'List Element Not Found!!' })
        }

        const updateElem = { title }
        await List.update(updateElem, { where: { id } })

        return res.status(201).json({ Status: 201, Message: 'Element Updated Successfully!!', Data: await List.findByPk(id) })
    } catch (error) {
        console.log(error)

        return res.status(500).json({ Status: 500, Message: 'Something Went Wrong!' })
    }
}

exports.deleteList = async (req, res) => {
    try {
        const id = req.params.id
        const del = await List.destroy({ where: { id } })

        if (!del) {
            return res.status(404).json({ Status: 404, Message: 'List Element Not Found!!' })
        }

        return res.status(200).json({ Status: 200, Message: 'Element Deleted Successfully!' })
    } catch (error) {
        console.log(error)

        return res.status(500).json({ Status: 500, Message: 'Something Went Wrong!' })
    }
}