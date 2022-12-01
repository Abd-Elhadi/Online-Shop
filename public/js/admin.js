const deleteProduct = (button) => {
    const prodId = button.parentNode.querySelector('[name=productId]').value;
    const csrf = button.parentNode.querySelector('[name=_csrf]').value;
    

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });
};