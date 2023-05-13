async function deleteProduct(id) {
    try {
        const response = await fetch(`/product/${id}/delete`, {
            method: 'DELETE',
        });

        if (response.status === 200) {
            location.reload();
        } else {
            alert('Failed to delete product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete product');
    }
}
