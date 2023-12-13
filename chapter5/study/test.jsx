// context 생성
// CounterStoreContext 에 어떤 context 를 만들지 타입과 함께 정의
export const CounterStoreContext = createContext<Store<CounterStore>>(
    createStore<CounterStore>({Count:0,text:'hello'}),
)


// 정의한 context 를 CounterStoreProvider 에 사용
// context 는 provider 에 의존한다.
export const CounterStoreProvider =({
    initialState,
    children,
}: PropsWithChildren<{
    initialState: ConterStore
}>)=>{
    // 불필요한 props 변경으로 리렌더링을 막기위해 storeRef 사용 
    // useRef 사용을 오직 최초 렌더링에서만 스토어 값을 만들어 내려주게 된다. 
    const storeRef=useRef<Store<CounterStore>>()

    // 스토어를 생성한 적이 없다면 최초에 한 번 생성한다. 
    if (!storeRef.current){
        storeRef.current=createStore(initialState)
    }

    return (
        // provider 를 선언해 감싸준다.
        <CounterStoreContext.Provider value={storeRef.current}>
            {children}
        </CounterStoreContext.Provider>
    )
}

이제 위 context 를 사용하기 위해 스토어에 접근할수있는 새로운 훅이 필요한다

export const useCounterContextSelector = <State extends unknown>(
    selector:(state:CounterStore)=>State,
) => {
    // 스토어에 접근하기 위해 useContext 를 사용했다. -> 스토어에서 값을 찾는게 아니라 Context.Privider 에서제공된 스토어를 찾게 만드는 것이다.
    const store = useContext(CounterStoreContext)
    // 불필요한 반복을 제거하기 위해 
    // useStoreSelector 대신 리엑트에서 제공하는  useSubscription 를 사용했다. 
    const subscription = useSubscription(
        useMemo(
            ()=>({
                getCurrentValue:()=>selector(store.get()),
                subscribe:store.subscribe,
            }),
            [store,selector],
        ),
    )
    return [subscription,store.set] as const
}

/* -------------------------------------------------------------------------- */

const ContextCounter = () =>{
    const id = useId()

    const[counter,setStore]=useConterContextSelector(
        useCallback((state:CounterStore)=>state.count,[]),

        function handleClick(){
            setStore((prev)=>({...prev,count:prev.count+1}))
        }
        useEffect(()=>{
            console.log(`${id} Counter Rendered`);
        })
        
        return (
            <div>
                {counter} <button onClick={handleClick}>+</button>
            </div>
        )
    )
}

const ContextInput = () => {
    const id = useId()
    const [text, setStore] = useCounterContextSelector(
        useCallback((state:CounterStore) => state.text,[]),
    )
    
    function handleChange(e:ChangeEvent<HTMLInputElement>){
        setStore((prev)=>({...prev,text:e.target.value}))
    }

    useEffect(()=>{
        console.log(`${id} Counter Rendered`);
    })

    return(
        <div>
            <input value={text} onChange={handleChange} />
        </div>
    )
}

export default function App(){
    return(
        <>
        {/* Provider 가 없는 상황에서 전역으로 생성된 스토어를 바라보기 때문에 
        CounterStoreContext 가 존재하지 않아도 ContextCounter와ContextInput는 초깃값을 가져올수 있다.  */}
            <ContextCounter />
            <ContextInput />

            <CounterStorePrivider initialState={{count:10}, text:'hello'}>
                {/* ContextCounter와ContextInput는 초기화된 {count:10}, text:'hello'} 를 값으로 가져오게 된다. */}
                <ContextCounter />
                <ContextInput />

                <CounterStorePrivider initialState={{count:20}, text:'welcome'}>
                    {/* ContextCounter와ContextInput는 가장 가까운 {count:20}, text:'welcome' 를 값으로 가져오게 된다. */}
                    <ContextCounter />
                    <ContextInput />
                <CounterStorePrivider/>
            <CounterStorePrivider/>
        </>
    )
}