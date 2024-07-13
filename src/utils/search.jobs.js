

export const search=(filters)=>{

    let searchfilters={}

    if(filters.workingTime) searchfilters.workingTime={$regex:filters.workingTime,$options:'i'}
    if(filters.jobTitle) searchfilters.jobTitle={$regex:filters.jobTitle,$options:'i'}
    if(filters.technicalSkills) searchfilters.technicalSkills={$regex:filters.technicalSkills,$options:'i'}
    if(filters.seniorityLevel) searchfilters.seniorityLevel={$regex:filters.seniorityLevel,$options:'i'}
    if(filters.jobLocation) searchfilters.jobLocation={$regex:filters.jobLocation,$options:'i'}

    return searchfilters
}

