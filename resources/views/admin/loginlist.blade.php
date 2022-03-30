@extends('layouts.dashboardLayout')
@section('content')
    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <h2>Users</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Character</th>
              <th scope="col">about</th>
              <th scope="col">Created_at</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
          <?php $i = 1;?>
              @foreach($users as $user)
             <tr>
                  <td>{{$i}}</td>
                  <td>{{$user->name}}</td>
                  <td>{{$user->email}}</td>
                  <td>{{$user->avatar_path}}</td>
                  <td>{{$user->about}}</td>
                  <td>{{$user->created_at}}</td>
                  <td>
                      <select class="cellst" id="{{$user->id}}">
                          <option value="" selected>-Select-</option>
                          <option value="del">Delete</option>
                      </select>
                  </td>
              </tr>
             <?php $i++; ?>
              @endforeach
          </tbody>
        </table>
      </div>
    </main>
@endsection
