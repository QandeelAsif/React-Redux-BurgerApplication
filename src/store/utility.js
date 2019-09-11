export const updateObjects = (oldObject, updatedObject) => {
    return{
        ...oldObject,
        ...updatedObject
    }
}