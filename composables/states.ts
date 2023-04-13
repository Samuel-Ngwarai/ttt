const next = ref('X');

export const nextLetter = () => useState<string>('nextLetter', () => {
    const temp = next.value;
    console.log(temp);
    
    next.value = next.value === 'X' ? 'O' : 'X';
    return temp;
})
